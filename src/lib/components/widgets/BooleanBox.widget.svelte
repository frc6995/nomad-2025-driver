<script>
    export let value;
    export let label;
    export let trueColor = "green";
    export let falseColor = "red";
    export let borderColor = "black";
    export let borderRadius = "0%";
    export let transform = "translate(0,0)";
</script>
<div style={`
    width:100%; height: 100%;
    background-color:${value? trueColor : falseColor};
    border: 2px solid ${borderColor};
    border-radius: ${borderRadius};
    transform: ${transform};
    `}><div style="width:100%; height: 100%;
        display: flex; align-items:center; justify-content:center; font-size:large"><span>{label}</span></div></div>