<template>
  <div class="home">
    <div class="workspace-title">
      <h3 style="flex:1">Workspaces</h3>
      <Button_
        class="flat"
        icon-left="refresh"
        secondary
        @click="refreshState"
        :tag="(current.state.sessions||[]).length"
      >sessions</Button_>
      <Button_ class="icon-button" icon-left="refresh" @click="refresh" :tag="workspaces.length" />
    </div>
    <ul class="workspace-list">
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
              <template v-if="(grouped[item.id] || []).length">
                <template v-for="suffix in (grouped[item.id] || [])">
                  <VueDropdown :key="suffix" :label="suffix || '·'" button-class="warning">
                    <div class="vue-ui-grid default-gap col-1">
                      <VueDropdownButton
                        class="danger"
                        @click="killWithSuffix(item.id,suffix)"
                        icon-left="close"
                      >关闭</VueDropdownButton>
                      <VueDropdownButton
                        v-tooltip="`TODO`"
                        class="info"
                        icon-left="open_in_browser"
                      >Attach</VueDropdownButton>
                    </div>
                  </VueDropdown>
                  <Divider :key="`${suffix}_`" type="vert" />
                </template>
              </template>
              <template v-else>
                <Button_
                  key="open"
                  :disabled="item.tmuxOn"
                  class="primary"
                  icon-left="view_compact"
                  @click="openTmux(item.id)"
                >Tmux</Button_>
                <Divider type="vert" />
              </template>
              <Button_
                key="new"
                class="icon-button primary"
                icon-right="fiber_new"
                @click="openTmux(item.id,false,true)"
              />
              <Divider type="vert" />
              <Button_ class="accent icon-button" icon-left="vsc" @click="launchVsc(item.id)" />
            </div>
          </summary>
          <ul class="workspace-folders">
            <li v-for="(folder,i) in item.folders" :key="i" class="workspace-folder">
              <span class="folder-name">{{folder.name || ''}} {{folder.path}}</span>
              <span class="actions">
                <Button_ class="flat icon-button" icon-left="vsc" @click="launchVsc(folder.path)" />
              </span>
            </li>
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
import LAUNCH_VSC from "@/graphql/common/launchVsc.gql";
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
    current: {
      query: CURRENT,
      variables: {
        force: true
      }
    }
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
    refreshState() {
      return this.$apollo.queries.current.refetch();
    },
    refresh() {
      return this.$apollo.queries.workspaces.refetch();
    },
    launchVsc(name) {
      return this.$apollo.mutate({
        mutation: LAUNCH_VSC,
        variables: {
          name
        }
      });
    },
    openTmux(name, force, _new) {
      return this.$apollo.mutate({
        mutation: OPEN_TMUX,
        variables: {
          name,
          force,
          new: _new
        },
        update: (store, { data: { result: current } }) => {
          store.writeQuery({
            query: CURRENT,
            variables: { force: true },
            data: { current }
          });
        }
      });
    },
    killSession(name) {
      return this.$apollo.mutate({
        mutation: KILL_TMUX,
        variables: {
          name
        },
        update: (store, { data: { result: current } }) => {
          store.writeQuery({
            query: CURRENT,
            variables: { force: true },
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
<style lang="stylus">
.wm-move {
  -webkit-user-select: none;
  -webkit-app-region: drag;
}
</style>
<style lang="stylus" scoped>
.home {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.workspace-title {
  flex: 0 0 auto;
  display: flex;
  padding: 0em 10px;
  -webkit-user-select: none;
  -webkit-app-region: drag;
  cursor: move;
}

.workspace-list {
  padding: 1em 10px 0em;
  flex: 1;
  overflow: auto;
  margin: 0;
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

.workspace-folder {
  display: flex;

  .folder-name {
    flex: 1;
    word-break: break-all;
  }
}
</style>
