<template>
  <section>
    <aside>
      <label>
        <span>线宽增减： </span>
        -7 <input id="weight" type="range" min="-7" max="8" value="5" v-model="changedWeight" @change="changeWeight"/> 8
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
            v-model="minOrMax"
            @change="changeMinAndMax('max')"
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
            v-model="minOrMax"
            @change="changeMinAndMax('max')"
        />
        500
      </label>
      <br/>
      <label>
        <span>0%</span>
        <input id="paletteColor1" type="color" v-model="color1" @change="changeColor"/>
      </label>
      <label>
        <span>50%</span>
        <input id="paletteColor2" type="color" v-model="color2" @change="changeColor"/>
      </label>
      <label>
        <span>100%</span>
        <input id="paletteColor3" type="color" v-model="color3" @change="changeColor"/>
      </label>
    </aside>
  </section>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      changedWeight: 0,
      color1: "#008800",
      color2: "#ffff00",
      color3: "#ff0000",
      minOrMax: 0
    }
  },
  computed: {
    //所有的heatLine
    heatLineLayer() {
      return this.$store.state.view.heatLineLayer
    },
    //当前点击的heatLine
    editingLine() {
      return this.$store.state.view.editingLineLayer
    }
  },
  methods: {
    changeWeight() {
      let arr = this.editingLine.options.extraValue;
      let temp = arr.forEach((item, index, arr) => {
        arr[index] += Number(this.changedWeight);
      })
      this.editingLine.redraw()
    },
    changeColor() {
      this.heatLineLayer.setStyle({
        'palette': {
          0.0: this.color1,
          0.5: this.color2,
          1.0: this.color3
        }
      });
    },
    changeMinAndMax(key) {
      let val = Number(this.minOrMax);
      if (key === 'max') {
        this.heatLineLayer.setStyle({max: val})
      }

    }
  }
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
