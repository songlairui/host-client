<template>
  <div class="home">
    <div style="display: flex;padding-bottom: 1em">
      <h3 style="flex:1">Workspaces</h3>
      <pre>{{current}}</pre>
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
              <Button_ class="primary" icon-left="code" @click="wait()">Editor</Button_>
              <Divider type="vert" />
              <VueGroup class="inline">
                <GroupButton_
                  key="open"
                  :disabled="item.tmuxOn"
                  class="primary"
                  icon-left="view_compact"
                  @click="openTmux(item.id)"
                >Tmux</GroupButton_>
                <GroupButton_
                  key="stop"
                  class="danger icon-button"
                  icon-right="stop"
                  @click="killSession(item.id)"
                />
                <GroupButton_
                  key="new"
                  class="icon-button"
                  icon-right="fiber_new"
                  @click="openTmux(item.id,false,true)"
                />
              </VueGroup>
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
import CURRENT from "@/graphql/current.gql";
import WORKSPACE_LIST from "@/graphql/workspace/list.gql";
import OPEN_TMUX from "@/graphql/tmux/openTmux.gql";
import KILL_TMUX from "@/graphql/tmux/killTmux.gql";

export default {
  name: "home",
  data() {
    return {
      subloading: false,
      workspaces: [],
      refetching: false,
      current: {}
    };
  },
  apollo: {
    workspaces: WORKSPACE_LIST,
    current: CURRENT
  },
  methods: {
    wait(time = 500) {
      return new Promise(r => setTimeout(r, time));
    },
    async refresh() {
      this.refetching = true;
      try {
        await this.$apollo.queries.workspaces.refetch();
      } catch (error) {
        //
      }
      this.refetching = false;
    },
    async openTmux(name, force, n) {
      await this.$apollo.mutate({
        mutation: OPEN_TMUX,
        variables: {
          name,
          force,
          n
        },
        update: store => {
          console.info(store);
          // store.writeQuery({
          //   query: FOLDER_CURRENT,
          //   data: { folderCurrent: folderOpen }
          // });
        }
      });
    },
    async killSession(name) {
      console.info(name);
      await this.$apollo.mutate({
        mutation: KILL_TMUX,
        variables: {
          name
        },
        update: store => {
          console.info(store);
          // store.writeQuery({
          //   query: FOLDER_CURRENT,
          //   data: { folderCurrent: folderOpen }
          // });
        }
      });
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
