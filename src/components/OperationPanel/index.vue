<template>
  <section>
    <aside>
      <label>
        <span>Weight - </span>
        1 <input id="weight" type="range" min="1" max="16" value="5" /> 16
      </label>
      <br />
      <label>
        <span>Outline width - </span>
        0 <input id="outlineWidth" type="range" min="0" max="8" value="1" /> 8
      </label>
      <label>
        <span>Outline color</span>
        <input id="outlineColor" type="color" value="#000000" />
      </label>
      <br />
      <label>
        <span>Min - </span>
        100
        <input
            id="min"
            type="range"
            min="100"
            max="250"
            value="150"
            steps="5"
        />
        250
      </label>
      <label>
        <span>Max - </span>
        250
        <input
            id="max"
            type="range"
            min="250"
            max="500"
            value="350"
            steps="5"
        />
        500
      </label>
      <label>
        <span>Palette color 1</span>
        <input id="paletteColor1" type="color" value="#008800" />
      </label>
      <label>
        <span>Palette color 2</span>
        <input id="paletteColor2" type="color" value="#ffff00" />
      </label>
      <label>
        <span>Palette color 3</span>
        <input id="paletteColor3" type="color" value="#ff0000" />
      </label>
      <label>
        <span>Smooth factor - </span>
        0 <input type="range" id="smoothFactor" value="1" min="0" max="10" /> 10
      </label>
    </aside>
  </section>
</template>

<script>
export default {
  name: "index"
}
</script>

<style scoped>
section {
  max-width: 600px;
  /* margin: 1.5em auto; */
  text-align: center;
}
aside {
  margin: 1.5em 0;
}
label {
  display: inline-block;
  padding: 0.5em;
}
input {
  vertical-align: text-bottom;
}
</style>
