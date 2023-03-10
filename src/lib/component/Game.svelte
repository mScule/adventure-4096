<script lang="ts">
    import { onMount, onDestroy, getContext } from "svelte";
    import Context, {
        type DJContext,
        type SoundPlayerContext
    } from "../types/Context";

    import type Level from "../types/Level";

    import TileType from "../types/TileType";
    import Movement from "../types/Movement";

    import GameDisplay from "./GameDisplay.svelte";
    import Title from "./Title.svelte";
    import Controls from "./Controls.svelte";

    import { isInsideGrid, moveTileInGrid } from "../game/Grid";
    import { isWalkable } from "../game/Tile";

    import readLevel from "../game/LevelReader";
    import StackLevel from "../types/StackLevel";

    import SoundType from "../types/SoundType";
    import SoundPlayer from "./SoundPlayer.svelte";

    export let title: string;
    export let level: Level;

    export let handleWinning: () => void;
    export let handleExit: () => void;

    const winningPoints = level.winningPoints;

    let { player, traps, grid } = readLevel(level);
    let lastMovement: Movement = Movement.None;

    let points = 0;
    let boxes = 0;
    let died = false;

    let boulders: ({ location: number; movement: Movement } | null)[] = [];
    let boulderInterval = null;

    let trapSpikes: number[] = traps;
    let trapSpikesInterval = null;

    const { requestTrack } = getContext<DJContext>(Context.DJ);
    const { playSound } = getContext<SoundPlayerContext>(Context.SoundPlayer);

    const getLowerTileAt = (location: number): TileType =>
        isInsideGrid(grid, location)
            ? grid[location][StackLevel.Lower]
            : TileType.Void;

    function setLowerTileAt(location: number, tile: TileType) {
        if (isInsideGrid(grid, location))
            grid[location][StackLevel.Lower] = tile;
    }

    const getHigherTileAt = (location: number): TileType =>
        isInsideGrid(grid, location)
            ? grid[location][StackLevel.Higher]
            : TileType.Void;

    function setHigherTileAt(location: number, tile: TileType) {
        if (isInsideGrid(grid, location))
            grid[location][StackLevel.Higher] = tile;
    }

    const tileIsNotVoidAt = (location: number) =>
        getHigherTileAt(location) !== TileType.Void;

    function movePlayer(movement: Movement) {
        const newLocation = moveTileInGrid(grid, player, movement);
        lastMovement = movement;

        const handleBoxInteraction = () => {
            const newBoxLocation = moveTileInGrid(grid, newLocation, movement);

            const newLocationIsOutsideGrid = () =>
                newBoxLocation === newLocation;

            if (newLocationIsOutsideGrid() || tileIsNotVoidAt(newBoxLocation)) {
                playSound(SoundType.HigherHit);
                return false;
            } else if (getLowerTileAt(newBoxLocation) === TileType.Void) {
                setLowerTileAt(newBoxLocation, TileType.LowerBox);
                playSound(SoundType.LowerHit);
            } else {
                setHigherTileAt(newBoxLocation, TileType.UpperBox);
                playSound(SoundType.HigherBox);
            }
            return true;
        };

        const handleBoulderInteraction = () => {
            const newBoulderLocation = moveTileInGrid(
                grid,
                newLocation,
                movement
            );

            const newLocationIsOutsideGrid = () =>
                newBoulderLocation === newLocation;

            if (
                newLocationIsOutsideGrid() ||
                tileIsNotVoidAt(newBoulderLocation)
            ) {
                playSound(SoundType.HigherHit);
                return false;
            } else if (getLowerTileAt(newBoulderLocation) === TileType.Void) {
                setLowerTileAt(newBoulderLocation, TileType.LowerBoulderSunken);
                playSound(SoundType.LowerHit);
            } else if (
                getLowerTileAt(newBoulderLocation) ===
                TileType.LowerBoulderSunken
            ) {
                setLowerTileAt(newBoulderLocation, TileType.LowerBoulderAfloat);
                playSound(SoundType.LowerHit);
            } else {
                setHigherTileAt(
                    newBoulderLocation,
                    TileType.UpperBoulderMoving
                );
                boulders = [
                    ...boulders,
                    {
                        location: newBoulderLocation,
                        movement: movement,
                    },
                ];
            }
            return true;
        };

        if (
            isWalkable(getLowerTileAt(newLocation)) &&
            getHigherTileAt(newLocation) !== TileType.UpperSolid &&
            getHigherTileAt(newLocation) !== TileType.UpperBoulderMoving
        ) {
            if (getHigherTileAt(newLocation) === TileType.UpperBoulder)
                if (!handleBoulderInteraction()) return;

            if (getHigherTileAt(newLocation) === TileType.UpperBox)
                if (!handleBoxInteraction()) return;

            if (getLowerTileAt(player) === TileType.LowerBox) {
                setLowerTileAt(player, TileType.Void);
                playSound(SoundType.HigherDestruction);
            }

            if (getHigherTileAt(newLocation) === TileType.CollectablePointOne) {
                points++;
                playSound(SoundType.CollectablePointOne);
            }

            if (
                getHigherTileAt(newLocation) === TileType.CollectablePointFive
            ) {
                points += 5;
                playSound(SoundType.CollectablePointFive);
            }

            if (getHigherTileAt(newLocation) === TileType.CollectableBox) {
                boxes++;
                playSound(SoundType.CollectableBoxCollect);
            }

            setHigherTileAt(player, TileType.Void);
            setHigherTileAt(newLocation, TileType.Player);

            player = newLocation;
        }
    }

    function spawnBox() {
        if (lastMovement !== Movement.None && boxes > 0) {
            const spawnPosition = moveTileInGrid(grid, player, lastMovement);
            if (
                isInsideGrid(grid, spawnPosition) &&
                getHigherTileAt(spawnPosition) === TileType.Void &&
                (getLowerTileAt(spawnPosition) === TileType.LowerSolid ||
                    getLowerTileAt(spawnPosition) === TileType.Void)
            ) {
                boxes--;

                if (getLowerTileAt(spawnPosition) === TileType.Void) {
                    setLowerTileAt(spawnPosition, TileType.LowerBox);
                } else {
                    setHigherTileAt(spawnPosition, TileType.UpperBox);
                }

                playSound(SoundType.CollectableBoxPlace);
            }
        }
    }
    function moveBoulder(location: number, movement: Movement) {
        const newBoulderLocation = moveTileInGrid(grid, location, movement);

        const newLocationIsOutsideGrid = () => newBoulderLocation === location;

        const removeFromMovingBoulders = () => {
            boulders[
                boulders.findIndex(
                    (b) =>
                        b && b.location === location && b.movement === movement
                )
            ] = null;
        };

        setHigherTileAt(location, TileType.Void);

        if (
            newLocationIsOutsideGrid() ||
            getHigherTileAt(newBoulderLocation) !== TileType.Void
        ) {
            setHigherTileAt(location, TileType.UpperBoulder);
            removeFromMovingBoulders();
            playSound(SoundType.HigherHit);
            return;
        }

        if (getLowerTileAt(newBoulderLocation) === TileType.Void) {
            setLowerTileAt(newBoulderLocation, TileType.LowerBoulderSunken);
            removeFromMovingBoulders();
            playSound(SoundType.LowerHit);
            return;
        }

        if (
            getLowerTileAt(newBoulderLocation) === TileType.LowerBoulderSunken
        ) {
            setLowerTileAt(newBoulderLocation, TileType.LowerBoulderAfloat);
            removeFromMovingBoulders();
            playSound(SoundType.LowerHit);
            return;
        }

        setHigherTileAt(newBoulderLocation, TileType.UpperBoulderMoving);
        const foundIndex = boulders.findIndex(
            (b) => b && b.location === location && b.movement === movement
        );

        playSound(SoundType.HigherBoulder);

        if (foundIndex !== -1 && boulders[foundIndex])
            boulders[foundIndex].location = newBoulderLocation;
    }

    const handleUp = () => movePlayer(Movement.Up);
    const handleDown = () => movePlayer(Movement.Down);
    const handleLeft = () => movePlayer(Movement.Left);
    const handleRight = () => movePlayer(Movement.Right);

    function handleActionPrimary() {
        if (died) {
            const restartedLevel = readLevel(level);
            player = restartedLevel.player;
            grid = restartedLevel.grid;
            traps = restartedLevel.traps;
            died = false;
            points = 0;
            boxes = 0;
        } else if (points < winningPoints) {
            spawnBox();
        } else {
            handleWinning();
        }
    }

    const handleActionSecondary = () => handleExit();

    function updateBoulders() {
        if (boulders.length === 0) {
            return;
        }

        for (const boulder of boulders) {
            if (boulder !== null) {
                moveBoulder(boulder.location, boulder.movement);
            }
        }

        boulders = [...boulders.filter((boulder) => boulder !== null)];
    }

    function updateTraps() {
        for (const trap of trapSpikes) {
            if (getLowerTileAt(trap) === TileType.LowerTrapSpikesOff) {
                setLowerTileAt(trap, TileType.LowerTrapSpikesOn);
                playSound(SoundType.LowerTrapSpikesUp);
                if (getHigherTileAt(trap) === TileType.Player) {
                    died = true;
                } else if (getHigherTileAt(trap) !== TileType.Void) {
                    setHigherTileAt(trap, TileType.Void);
                    playSound(SoundType.HigherDestruction);
                }
            } else {
                setLowerTileAt(trap, TileType.LowerTrapSpikesOff);
                playSound(SoundType.LowerTrapSpikesDown);
            }
        }
    }

    onMount(() => {
        boulderInterval = setInterval(updateBoulders, 200);
        trapSpikesInterval = setInterval(updateTraps, 1000);
        requestTrack(level.track);
    });

    onDestroy(() => {
        clearInterval(boulderInterval);
        clearInterval(trapSpikesInterval);
    });
</script>

<GameDisplay
    {title}
    {points}
    {boxes}
    {died}
    {winningPoints}
    world={level.world}
    winningText={level.winningText}
    stacks={grid}
/>
<Title {title} />
<Controls
    {handleUp}
    {handleDown}
    {handleLeft}
    {handleRight}
    {handleActionPrimary}
    handleActionSecondary={!died && points < winningPoints
        ? handleActionSecondary
        : null}
/>
