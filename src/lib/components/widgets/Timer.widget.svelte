<script>

    export let name;
    export let value;
    export let max = 135.0;
    export let hms=false;
    export let showBar=true;
    export let color = "yellow";
    let w;
    let h;
</script>
<style>
    .container {
        width:100%;
        height: 100%;
        text-align:center;
        display:flex;
        flex-direction: column;
        justify-content: space-between;
        border:2px solid white;

    }
    .bar {
        height:10%;
        align-self: end;
        
    }
</style>
<div class="container" style=" font-size:calc(0.5 * min({w}px,{h}px));color:{color};"
    bind:clientWidth={w} bind:clientHeight={h}>
    <div style="height:10%; width:100%; font-size: calc(0.2 * {h}px); color:{color};">{name}</div>
    {#if hms}
    {value === -1 ? "--": `${Math.floor(value / 60).toFixed(0)}:${(value % 60).toFixed(1).toString().padStart(4, '0')}`}
    {:else}
    {value === -1 ? "--": value.toFixed(1)}
    {/if}
    {#if showBar}
    <div class="bar" style="width:calc(100% * max(0, min({max == 0 ? 0 : value / max}, 1))); background:{color};"></div>
    {/if}
</div>