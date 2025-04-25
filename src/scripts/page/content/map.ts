import { createTicTacToeRoot } from "./tictactoe-root";
import type { GameStateTree } from "@shared/state/game-state-tree";
import { GameStateTreeImpl } from "@shared/state/game-state-tree-impl";
import type { LocalMapPersister } from "../store/local-map-persister";
import type { Theme, Grid } from "../ui";
import type { MapRenderer, TicTacToeMap, RenderedMap, MapRendererEventMap, StateRenderer} from "../map";
import type { GameState } from "@shared/state/game-state";
import { createBroadcastChannelRenderer } from "../store/broadcast-channel-renderer";
import { createMapPersister } from "../store/map-persister";
import type { AsyncWork } from "@shared/remote-communication";
import type { SharedWork } from "@shared/shared-work/shared-work";
import type { EventTargetLike } from "../events/types";

export function createTicTacToeMap(
    localPersister: LocalMapPersister,
    broadcastChannel: BroadcastChannel,
    sharedWorkClient: AsyncWork<SharedWork>
): TicTacToeMap {
    let tree: GameStateTree = GameStateTreeImpl.initial;
    const mapRenderers: MapRenderer[] = [];
    const stateRenderers: StateRenderer[] = [];
    const remote = createBroadcastChannelRenderer(broadcastChannel);
    const mapPersister = createMapPersister(localPersister, sharedWorkClient);

    remote.addEventListener('staterevealed', (s) => {
        revealState(s);
        notifyRenderers();
    })
    remote.addEventListener('statehidden', (s) => {
        hideState(s);
        notifyRenderers();
    })

    return { load, renderOnGrid, addStateRenderer }

    function notifyRenderers(): void {
        for(const mapRenderer of mapRenderers){
            mapRenderer.setTree(tree);
        }
    }

    function persist(): void {
        mapPersister.persist(tree.toJSON());
    }

    function revealState(state: GameState): void {
        tree = tree.addState(state);
        for(const stateRenderer of stateRenderers){
            stateRenderer.revealState(state);
        }
    }

    function hideState(state: GameState): void {
        tree = tree.removeState(state)!;
        for(const stateRenderer of stateRenderers){
            stateRenderer.hideState(state);
        }
    }

    async function load(): Promise<void> {
        const serialized = await mapPersister.read();
        if(serialized){
            tree = GameStateTreeImpl.fromJSON(serialized);
            notifyRenderers();
            mapPersister.persist(serialized)
        }else{
            persist();
        }
       
    }

    function subscribeToRenderer(renderer: EventTargetLike<MapRendererEventMap>): void {
        renderer.addEventListener('staterevealed', (s) => {
            revealState(s);
            persist();
            notifyRenderers();
            remote.revealState(s);
        });
        renderer.addEventListener('statehidden', (s) => {
            hideState(s);
            persist();
            notifyRenderers();
            remote.hideState(s);
        });
    }

    function addStateRenderer(renderer: StateRenderer & EventTargetLike<MapRendererEventMap>){
        subscribeToRenderer(renderer);
        stateRenderers.push(renderer);
    }
    function addRenderer(renderer: MapRenderer & EventTargetLike<MapRendererEventMap>): void {
        subscribeToRenderer(renderer);
        mapRenderers.push(renderer);
    }

    function renderOnGrid<TTheme extends Theme>(
        grid: Grid<TTheme>
    ): RenderedMap<TTheme> {
        const root = createTicTacToeRoot(
            grid,
            tree
        );
        addRenderer(root);
        return root;
    }
}