<template>
  <div>
    <TopMenu />
    <div style="display: flex">
      <div style="width: 12%">
        <SideMenu/>
      </div>
      <div style="width:88%;">
        <router-view v-if="isRouterAlive"/>
      </div>
    </div>

  </div>
</template>

<script>
import TopMenu from "@/components/TopMenu";
import SideMenu from "@/components/SideMenu";

export default {
  name: "Home",
  components: {SideMenu, TopMenu},
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data(){
    return{
      isRouterAlive: true
    }
  },
  methods: {
    reload(){
      this.isRouterAlive = false;
      this.$nextTick(function (){
        this.isRouterAlive = true;
      })
    }
  },
  computed: {
    showState: function () {
      return this.$store.state.currentuser;
    }
  },
}
</script>

<style scoped>

</style>