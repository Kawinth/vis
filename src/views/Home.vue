<template>
  <div class="home">
    
    <LMap/>
  </div>
</template>

<script>
// @ is an alias to /src
import LMap from '@/components/Map/PipeEdit.vue'

export default {
  name: 'Home',
  components: {
    LMap
  }
}
</script>
