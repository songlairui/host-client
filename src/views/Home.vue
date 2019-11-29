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
              <Button_ secondary class="accent" icon-left="code" @click="wait()">Editor</Button_>
              <Divider type="vert" />
              <VueGroup
                class="inline"
                :value="choice"
                indicator
                v-if="(grouped[item.id] || []).length"
              >
                <GroupButton_
                  v-for="suffix in (grouped[item.id] || [])"
                  :key="suffix"
                  class="danger round"
                  @click="killWithSuffix(item.id,suffix)"
                >{{suffix}}</GroupButton_>
              </VueGroup>
              <Button_
                v-else
                key="open"
                :disabled="item.tmuxOn"
                class="primary"
                icon-left="view_compact"
                @click="openTmux(item.id)"
              >Tmux</Button_>
              <Divider type="vert" />
              <Button_
                key="new"
                class="icon-button primary"
                icon-right="fiber_new"
                @click="openTmux(item.id,false,true)"
              />
            </div>
          </summary>
          <ul>
            <li v-for="(folder,i) in item.folders" :key="i">{{folder.name || ''}} {{folder.path}}</li>
          </ul>
        </details>
      </li>
    </ul>
    <pre>{{grouped}}</pre>
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
      current: { state: {} },
      choice: "" // 高亮
    };
  },
  apollo: {
    workspaces: WORKSPACE_LIST,
    current: CURRENT
  },
  computed: {
    grouped() {
      const { sessions = [] } = this.current.state || {};
      return sessions.reduce((result, item) => {
        const lastIdx = item.lastIndexOf("__");
        let name = item;
        let suffix = "";
        if (lastIdx > 0) {
          name = item.slice(0, lastIdx);
          suffix = item.slice(lastIdx + 2);
        }
        if (!result[name]) {
          result[name] = [];
        }
        result[name].push(suffix);
        return result;
      }, {});
    }
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
    async openTmux(name, force, _new) {
      await this.$apollo.mutate({
        mutation: OPEN_TMUX,
        variables: {
          name,
          force,
          new: _new
        },
        update: (store, { data: { result: current } }) => {
          store.writeQuery({
            query: CURRENT,
            data: { current }
          });
        }
      });
    },
    async killSession(name) {
      await this.$apollo.mutate({
        mutation: KILL_TMUX,
        variables: {
          name
        },
        update: (store, { data: { result: current } }) => {
          store.writeQuery({
            query: CURRENT,
            data: { current }
          });
        }
      });
    },
    killWithSuffix(name, suffix) {
      if (suffix) {
        name = `${name}__${suffix}`;
      }
      return this.killSession(name);
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
