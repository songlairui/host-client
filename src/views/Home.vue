<template>
  <div class="home">
    <div style="display: flex;padding-bottom: 1em">
      <h3 style="flex:1">Workspaces</h3>
      <VueButton
        class="icon-button big"
        icon-left="refresh"
        :loading-secondary="refetching"
        @click="refresh"
        :tag="workspaces.length"
      ></VueButton>
    </div>
    <ul>
      <li v-for="(item,idx) in workspaces" :key="idx" class="item">
        <details open>
          <summary class="item-header">
            <div style="flex:0 0 auto">
              <VueButton :tag="item.folders.length">
                <span class="title">{{item.id}}</span>
              </VueButton>
            </div>
            <div style="flex:4"></div>
            <div class="actions" @click="(e)=>e.preventDefault()">
              <VueButton class="primary" icon-left="mic">编辑器打开</VueButton>
              <Divider type="vert" />
              <VueButton class="primary" icon-left="flag">打开终端</VueButton>
            </div>
          </summary>
          <ul>
            <li v-for="(folder,i) in item.folders" :key="i">{{folder.name || ''}} {{folder.path}}</li>
          </ul>
        </details>
      </li>
    </ul>
  </div>
</template>

<script>
// @ is an alias to /src
import WORKSPACE_LIST from "@/graphql/workspace/list.gql";

export default {
  name: "home",
  data() {
    return {
      workspaces: [],
      refetching: false
    };
  },
  apollo: {
    workspaces: WORKSPACE_LIST
  },
  methods: {
    async refresh() {
      this.refetching = true;
      try {
        await this.$apollo.queries.workspaces.refetch();
      } catch (error) {
        //
      }
      this.refetching = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
.home {
  padding: 0.5em;
}

.item {
  border-radius: 3px;

  details {
    background: #fafcfd;
    margin-bottom: 0.5em;
  }

  summary {
    background: #f2f3f6;
    border-radius: 3px;
    outline: none;
    cursor: pointer;
  }

  summary::-webkit-details-marker {
    display: none;
  }

  .item-header {
    display: flex;
  }
}

.title {
  display: inline-flex;
  min-width: 5em;
  align-items: center;
  height: 100%;
  font-weight: bold;
}
</style>
