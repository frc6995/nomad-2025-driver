<script lang="ts">
    import TimerWidget from "$lib/components/widgets/Timer.widget.svelte"
    import Camera from "$lib/components/widgets/Camera.widget.svelte";
    import GridLayout from "$lib/components/widgets/GridLayout.svelte"
    import GridItem from "$lib/components/widgets/GridItem.svelte"
    import NT from "../util/NT"
    import Chooser from "$lib/components/widgets/Chooser.widget.svelte";
    import BooleanBox from "$lib/components/widgets/BooleanBox.widget.svelte";
    import { readable, get } from "svelte/store";
    import {appWindow} from "@tauri-apps/api/window"
    NT.setIP("localhost")
    //NT.setIP("10.69.95.2")
    let max = NT.NTInt(150, "/DriverDisplay/maxTime")
    let time = NT.NTDouble(-1, "/DriverDisplay/matchTime");

    let branch = NT.NTInt(0, "/DriverDisplay/branch");
    let level = NT.NTInt(0, "/DriverDisplay/level");
    let climb = NT.NTInt(0, "/DriverDisplay/climb");
    let data = "/SmartDashboard/autoChooser"
    let enabled = NT.NTBoolean(false, "/DriverDisplay/enabled");
    let autoOptions = NT.NTStringArray([], `${data.replace(/\/$/, '')}/options`);
	let autoSelected = NT.NTString("", `${data.replace(/\/$/, '')}/selected`)
	let autoActive = NT.NTString("", `${data.replace(/\/$/, '')}/active`)
    $: ntConnected = readable(false, function start(set) {
        const interval = setInterval(() => {
            set(NT.nt.isRobotConnected());
        }, 1000);

        return function stop() {
            clearInterval(interval);
        };
    });
    appWindow.onCloseRequested(async (event)=> {
        if (get(enabled)) {
            event.preventDefault();
        } else {
            appWindow.close();
        }
    })

    let hasNote = NT.NTBoolean(false, "/DriverDisplay/hasNote");

    let intakeHomed = NT.NTBoolean(false, "/DriverDisplay/intakeHomed");
    let controller1 = NT.NTBoolean(false, "/DriverDisplay/controller0");
    let controller2 = NT.NTBoolean(false, "/DriverDisplay/controller1");
    $: color = ($max > 20 && $time < 25 && $time >= 0) ? "yellow": "white";
    let reefX = 12;
    let reefY = 1;
    let levelX = 23;
    let levelY = 8;
    let squares = [
        [3,8], [5,8], [7,7], [8,5], [8,3], [7,1], [5, 0], [3, 0], [1,1], [0,3], [0,5],[1,7]
    ]
    let transform = [
        , ,, ["-8%", "10%"], ["-8%", "-10%"], , ,, , ["8%", "-10%"], ["8%", "10%"]
    ]
    let labels = [
        "A","B","C","D","E","F","G","H","I","J","K","L"
    ]
    let climbLabels = ["L", "M", "R"]
// Left to Right
// HAS NOTE | RANGE | ANGLE | PIVOT | SPEED | 
</script>
<main style="width:100vw; aspect-ratio: 16 / 9; overflow:hidden; box-sizing:border-box; background-color:#222222">
<GridLayout columns={28}>
<GridItem x={3} y={5} width={2} height={2}>
    <BooleanBox value={$hasNote} label="HAS CORAL"></BooleanBox>
</GridItem>

<!-- Non-critical feedback -->
<GridItem x={1} y={1} width={2} height={2}>
    <BooleanBox value={$ntConnected} label="Connection"></BooleanBox>
</GridItem>

<GridItem x={1} y={3} width={2} height={2}>
    <BooleanBox value={$controller1} label="DriverXbox"></BooleanBox>
</GridItem>
<GridItem x={1} y={5} width={2} height={2}>
    <BooleanBox value={$controller2} label="OpBoard"></BooleanBox>
</GridItem>
<GridItem x={1} y={7} width={2} height={2}>
    <BooleanBox value={$intakeHomed} label="All HOMED"></BooleanBox>
</GridItem>
<GridItem x={1} y={9} width={1} height={1}>
    <button on:click={()=>appWindow.close()}>Close</button>
</GridItem>
<!-- Reef -->
{#each squares as square, i}
    <GridItem x={reefX + square[0]} y={reefY+square[1]} width={2} height={2}>
        <BooleanBox value={$branch == i} label={labels[i]} falseColor="transparent" borderColor="white" borderRadius="50%"
        transform={`translate(${transform[i]?.[0]??"0%"}, ${transform[i]?.[1]??"0%"})`}></BooleanBox>
</GridItem>
{/each}
<!-- Level -->
{#each [0,1,2,3] as levelnum}
<GridItem x={levelX} y={levelY-(levelnum*2)} width={2} height={2}>
    <BooleanBox value={$level == levelnum} label={`L${levelnum + 1}`} falseColor="transparent" borderColor="white"></BooleanBox>
</GridItem>
{/each}
{#each [0,1,2] as climbnum}
<GridItem x={5+climbnum*2} y={5} width={2} height={2}>
    <BooleanBox value={$climb == climbnum} label={climbLabels[climbnum]} falseColor="transparent" borderColor="white"></BooleanBox>
</GridItem>
{/each}
<GridItem x={3} y={3} width={9} height={2}>
    <TimerWidget value={$time} name={""} max={$max} color={color}></TimerWidget>
</GridItem>
<GridItem x={3} y={1} width={10} height={2}>
    <Chooser options={$autoOptions} active={$autoActive} selectedStore={autoSelected} disabled={$enabled}></Chooser>
</GridItem>



</GridLayout>
</main>
