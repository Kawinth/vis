<template>
  <div class="about">
    <BubbleSets/>
  </div>
</template>

<script>
import BubbleSets from '@/components/BubbleSets/index'
import BubblePipe from '@/components/BubblePipe/index'


export default{
  name:'about',
  components:{
    BubbleSets,
    BubblePipe
  }
}
</script>
