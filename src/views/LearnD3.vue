<template>
  <div class="home">
    <!-- <l-map></l-map> -->
    <!-- <scale></scale> -->
    <!-- <d3-shape></d3-shape> -->
    <ribbon-pipe></ribbon-pipe>
  </div>
</template>

<script>
// @ is an alias to /src
import RibbonPipe from '@/components/Ribbon/index'
import LMap from '@/components/D3Components/HelloWorld'
import Scale from '@/components/D3Components/Scale'
import D3Shape from '@/components/D3Components/D3Shape'
export default {
  name: 'LearnD3',
  components: {
    LMap,
    Scale,
    D3Shape,
    RibbonPipe
  }
}
</script>
