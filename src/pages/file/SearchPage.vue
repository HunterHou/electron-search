<template>
  <div class="q-mg-md top" style="margin-bottom: 60px">
    <q-page-sticky style="z-index: 9;" position="left" :offset="[0, 0]">
      <q-btn round class="page-sticky" color="amber" text-color="black" icon="keyboard_arrow_left"
        v-if="view.queryParam.Page > 1" @click="nextPage(-1)"></q-btn>
    </q-page-sticky>

    <q-page-sticky style="z-index: 9;" position="right" :offset="[10, 10]">
      <q-btn round class="page-sticky" color="secondary" text-color="black" icon="keyboard_arrow_right"
        @click="nextPage(1)"></q-btn>
    </q-page-sticky>

    <div class="row justify-center q-gutter-sm" ref="top">
      <q-btn :loading="refreshIndexLoading" color="red" @click="refreshIndex">
        扫描【~】
        <template v-slot:loading> 执行中 </template>
      </q-btn>
      <q-btn-toggle v-model="view.queryParam.SortField" @update:model-value="fetchSearch()" toggle-color="primary"
        :options="[
          { label: '时', value: 'MTime' },
          { label: '容', value: 'Size' },
          { label: '名', value: 'Code' }
        ]" />
      <q-btn-toggle v-model="view.queryParam.SortType" @update:model-value="fetchSearch()" toggle-color="primary"
        :options="[
          { label: '正', value: 'asc' },
          { label: '倒', value: 'desc' }
        ]" />

      <q-btn-toggle v-model="view.queryParam.MovieType" @update:model-value="fetchSearch()" toggle-color="primary"
        :options="MovieTypeSelects" />
      <q-input id="searchBtn" label="..." v-model="view.queryParam.Keyword" :dense="true" filled clearable
        @update:model-value="fetchSearch()">
        <template v-slot:prepend>
          <q-icon name="ti-list" class="cursor-pointer">
            <q-popup-proxy>
              <div style="width: 200px;max-height: 50vh;">
                <q-list>
                  <q-item clickable v-ripple v-for="word in suggestions" :key="word"
                    @click="view.queryParam.Keyword = word; fetchSearch()">
                    <q-item-section>
                      <q-item-label>{{ word }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
            </q-popup-proxy>
          </q-icon>
        </template>
        <template v-slot:append>
          <q-icon name="ti-search" class="cursor-pointer" @click="fetchSearch">
          </q-icon>
        </template>

      </q-input>
      <q-checkbox v-model="view.queryParam.OnlyRepeat" @update:model-value="fetchSearch" label="重" />
      <q-btn class="q-mr-sm" size="sm" color="primary" icon="apps" @click="
        listEditRef.open({
          queryParam: view.queryParam,
          settingInfo: view.settingInfo,
          cb: listEditCallback
        })
        " />
    </div>
    <q-page-sticky position="bottom" style="z-index: 9; background-color: rgba(0, 0, 0, 0.3)">
      <div class="q-pa-sm flex flex-center">
        <q-select color="lime-11 q-mr-md" bg-color="green" dense @update:model-value="(no) => {
          view.queryParam.PageSize = Number(no);
          fetchSearch();
        }
          " filled v-model="view.queryParam.PageSize" :options="[10, 20, 30, 50, 200]">
        </q-select>
        <q-pagination v-model="view.queryParam.Page" @update:model-value="currentPageChange" color="deep-orange"
          :ellipses="true" :max="view.resultData.TotalPage || 0" :max-pages="10" boundary-numbers></q-pagination>
        <q-input v-model="view.queryParam.Page" :dense="true" type="search"
          style="background-color: aliceblue; width: 60px; text-align: center" @focus="focusEvent($event)"
          @update:model-value="(no) => {
            view.queryParam.Page = Number(no);
            fetchSearch();
          }
            " />
      </div>
    </q-page-sticky>

    <div class="row justify-center q-gutter-sm q-mr-sm q-mt-sm mainlist">
      <q-card class="q-ma-sm example-item" v-for="item in view.resultData.Data" :key="item.Id">
        <q-img fit="fit" easier draggable :src="getPng(item.Id)" class="item-img" @click="() => {
          fileInfoRef.open(item, refreshIndex);
        }">
          <div style="
              padding: 0;
              margin: 0;
              background-color: rgba(0, 0, 0, 0);
              display: flex;
              height: 2rem;
              flex-direction: row;
              justify-content: space-between;
              width: 100%;
            ">
            <div @click.stop="() => { }" style="
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                width: fit-content;
              ">
              <q-chip square text-color="white" style="
                  margin-left: 0px;
                  padding: 0 4px;
                  background-color: rgba(236, 15, 15, 0.872);
                ">
                <q-popup-proxy context-menu>
                  <div class="tag-popup">
                    <div>
                      <q-btn size="sm" icon='ti-minus' square text-color="white" color="green" class="tag-item"
                        v-for="tag in item.Tags" :key="tag" :label="tag"
                        @click="commonExec(CloseTag(item.Id, tag), true)" />
                    </div>
                    <div>
                      <q-btn size="sm" icon='ti-plus' square text-color="white" color="red" class="tag-item"
                        v-for="tag in  view.settingInfo.Tags" :key="tag" :label="tag"
                        @click="commonExec(AddTag(item.Id, tag), true)" />
                    </div>
                  </div>
                </q-popup-proxy>
                <span>种草</span>
              </q-chip>
              <q-chip square text-color="white" v-for="tag in item.Tags" :key="tag" style="
                  margin-left: 0px;
                  padding: 0 4px;
                  background-color: rgba(188, 24, 24, 0.6);
                ">
                <span @click="
                  view.queryParam.Keyword = tag;
                fetchSearch();
                ">{{ tag?.substring(0, 4) }}</span>
              </q-chip>
            </div>
            <div style="float: right;">
              <q-btn-dropdown style="background-color: rgba(0, 0, 0, 0.8);width: 85px;" :label="item.MovieType"
                @click.stop="() => { }">
                <q-list style="background-color: rgba(0, 0, 0, 0.7)">
                  <q-item v-for="mt in MovieTypeOptions" :key="mt.value" v-close-popup class="movieTypeSelectItem">
                    <q-item-section>
                      <q-item-label @click="setMovieType(item.Id, mt.value)">{{ mt.label }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>

          <div class="absolute-bottom" style="padding: 6px" @click.stop="() => { }">
            <div class="text-body1" @click.stop="() => { }">
              <q-btn round class="q-mr-sm" size="md" ripple color="red" icon="ti-fullscreen" @click="openPlay(item)" />
              <q-btn round class="q-mr-sm" size="md" ripple color="orange" icon="ti-blackboard"
                @click="openDialog(item)" />

            </div>

          </div>
        </q-img>
        <div class="text-subtitles">
          <div style="display: flex; flex-direction: row">
            <q-btn round class="q-mr-sm" size="sm" color="primary" icon="ti-control-eject"
              @click="commonExec(PlayMovie(item.Id))" v-if="showButton('播放')" />
            <q-btn round class="q-mr-sm" size="sm" color="primary" icon="ti-slice" @click="() => {
              fileEditRef.open(item, refreshIndex);
            }
              " v-if="showButton('编辑')" />
            <q-btn round class="q-mr-sm" size="sm" color="primary" icon="open_in_new" @click="openFolder(item)"
              v-if="showButton('文件夹')" />
            <q-btn round class="q-mr-sm" size="sm" color="brown-5" icon="wifi_protected_setup"
              v-if="!item.MovieType || item.MovieType == '无'" @click="commonExec(SyncFileInfo(item), true)" />
            <q-btn round class="q-mr-sm" size="sm" color="secondary" icon="ti-import"
              @click="commonExec(DownImageList(item.Id))" v-if="showButton('刮图')" />
            <q-btn round class="q-mr-sm" size="sm" color="amber" glossy text-color="black" icon="ti-trash"
              @click="confirmDelete(item)" v-if="showButton('删除')" />
            <q-btn round class="q-mr-sm" size="sm" color="black" @click="moveThis(item)" icon="ti-control-shuffle"
              v-if="showButton('移动')" />
          </div>
          <a style="color: #9e089e;background-color: rgba(0, 0, 0, 0.1);" class="mr10 cursor-pointer" @click="
            view.queryParam.Keyword = item.Actress;
          fetchSearch();
          ">{{ item.Actress?.substring(0, 6) }}</a>
          <a style="color: rgb(239, 30, 30);background-color: rgba(0, 0, 0, 0.1);" class="mr10 cursor-pointer"
            @click="copyText(item.Code)">{{ formatCode(item.Code) }}</a>
          <a style="color: rgb(22, 26, 227);background-color: rgba(0, 0, 0, 0.1);" class="mr10 cursor-pointer"
            @click="copyText(item.Title)">{{ item.SizeStr }}</a>
          <span>{{ formatTitle(item.Title) }}</span>
        </div>
      </q-card>
    </div>
  </div>
  <FileEdit ref="fileEditRef" />
  <FileInfo ref="fileInfoRef" />
  <ListEdit ref="listEditRef" />
</template>

<script setup>
import { useQuasar } from 'quasar';
import { computed, ref } from 'vue';

import { onMounted, reactive } from 'vue';
import { useRoute /* ,useRouter */ } from 'vue-router';
import {
  FileRename,
  OpenFileFolder,
  DownImageList,
  PlayMovie,
  RefreshAPI,
  ResetMovieType,
  SearchAPI,
  SyncFileInfo,
  AddTag,
  CloseTag,
  DeleteFile
} from '../../components/api/searchAPI';
import { GetSettingInfo } from '../../components/api/settingAPI';
import {
  MovieTypeOptions,
  MovieTypeSelects,
  formatCode,
  formatTitle
} from '../../components/utils';
import { getPng } from '../../components/utils/images';
import { useSystemProperty } from '../../stores/System';
import FileEdit from './components/FileEdit.vue';
import FileInfo from './components/FileInfo.vue';
import ListEdit from './components/ListEdit.vue';

import { onKeyStroke, useClipboard } from '@vueuse/core';

const fileEditRef = ref(null);
const fileInfoRef = ref(null);
const listEditRef = ref(null);
const source = ref('Hello');
const { copy } = useClipboard({ source });

// const { push } = useRouter()

const systemProperty = useSystemProperty();
const suggestions = computed(() => {
  return systemProperty.getSuggestions
})


const $q = useQuasar();

const listButtons = computed(() => {
  return view.settingInfo.Buttons;
});

const listEditCallback = (data) => {
  const { settingInfo } = data;
  if (settingInfo) {
    view.settingInfo = settingInfo;
  }

};

const showButton = (name) => {
  if (!listButtons.value || listButtons.value.length == 0) {
    return true;
  }
  return listButtons.value.indexOf(name) >= 0;
};

const openPlay = (item) => {
  console.log($q.platform)
  const url = `/playing/${item.Id}`
  // push(`/playing/${item.Id}`,'_blank')
  // window.open()
  window.electron.createWindow({ router: url, width: 1280, height: 1000 })
}

const view = reactive({
  currentData: {},
  settingInfo: {},
  queryParam: {
    Keyword: '',
    MovieType: '',
    OnlyRepeat: false,
    Page: 1,
    PageSize: 20,
    SortField: 'MTime',
    SortType: 'desc'
  },
  resultData: {},
  fullscreen: false
});

const focusEvent = (e) => {
  console.log(e);
  e.target.select();
};

const openFolder = (item) => {
  if ($q.platform.is.electron) {
    console.log(window.electron)
    window.electron.showInFolder(item.Path)
  } else {
    commonExec(OpenFileFolder(item.Id))
  }

}

const confirmDelete = (item) => {
  $q.dialog({
    title: item.Name,
    message: '确定删除吗?',
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      console.log('>>>> onOk');
      commonExec(DeleteFile(item.Id), true);
    })
    .onCancel(() => {
      console.log('>>>> Cancel');
    })
    .onDismiss(() => {
      // console.log('I am triggered on both OK and Cancel')
    });
};

const fetchGetSettingInfo = async () => {
  const data = await GetSettingInfo();
  view.settingInfo = data.data;
  systemProperty.SettingInfo = data.data;
};

const commonExec = async (exec, refresh) => {
  const { Code, Message } = (await exec) || {};
  console.log(Code, Message);
  if (Code != 200) {
    $q.notify({ message: `${Message}` });
  } else {
    if (refresh) {
      refreshIndex();
    }
  }
};

onKeyStroke(['`'], () => {
  refreshIndex();
});
onKeyStroke(['Enter'], () => {
  fetchSearch();
});

const copyText = async (str) => {
  await copy(str);
  $q.notify({ message: `${str}` });
};

const openDialog = (item) => {
  view.currentData = item;
  systemProperty.Playing = item;
  systemProperty.drawerRight = true;
};

const currentPageChange = async (e) => {
  console.log('view.queryParam.Page', e);
  await fetchSearch();
  const top = document.querySelector('.scroll')
  console.log(top)
  if (top) {
    top.scrollTo(0, 0)
  }
};

const nextPage = (n) => {
  view.queryParam.Page = view.queryParam.Page + n
  currentPageChange()
}

const fetchSearch = async () => {
  saveParam()
  const data = await SearchAPI(view.queryParam);
  console.log(data);
  view.resultData = { ...data };
};

const moveThis = async (item) => {
  const res = await FileRename({ ...item, NoRefresh: true, MoveOut: true });
  console.log(res);
  if (res.Code == 200) {
    $q.notify({ type: 'negative', message: res.Message });
  } else {
    $q.notify({ type: 'negative', message: res.Message });
  }
};

const refreshIndexLoading = ref(false);
const refreshIndex = async () => {
  refreshIndexLoading.value = true;
  const { Code, Message } = await RefreshAPI('/api/refreshIndex');
  console.log(Code, Message);
  if (Code == '200') {
    $q.notify({ type: 'negative', message: Message });
    await fetchSearch();
  }
  refreshIndexLoading.value = false;
};

const setMovieType = async (Id, Type) => {
  const { Code, Message } = await ResetMovieType(Id, Type);
  if (Code === '200') {
    $q.notify({ type: 'negative', message: Message });
  } else {
    $q.notify({ type: 'warning', message: Message });
  }
};

const saveParam = () => {
  systemProperty.syncSearchParam(view.queryParam);
  localStorage.setItem('queryParam', JSON.stringify(view.queryParam));
}

const thisRoute = useRoute();

onMounted(async () => {
  const {
    Page,
    PageSize,
    MovieType,
    SortField,
    SortType,
    Keyword,
    showStyle,
    from
  } = thisRoute.query;
  await fetchGetSettingInfo();
  if (Keyword) {
    view.queryParam.Keyword = Keyword;
  }
  if (Page && PageSize) {
    view.queryParam.Page = Number(Page);
    view.queryParam.PageSize = Number(PageSize);
    view.queryParam.MovieType = MovieType;
    view.queryParam.SortField = SortField;
    view.queryParam.SortType = SortType;
    view.queryParam.Keyword = Keyword;
    view.queryParam.showStyle = showStyle;
  } else {
    if (from == 'index') {
      const piniaParam = systemProperty.FileSearchParam;
      if (piniaParam) {
        console.log('piniaParam', piniaParam);
        view.queryParam = piniaParam;
      }
    } else {
      const storage = JSON.parse(localStorage.getItem('queryParam'));
      if (storage) {
        console.log('storage', storage);
        view.queryParam = storage;
      }
    }
  }

  fetchSearch();
});
</script>
<style lang="scss" scoped>
.example-item {
  padding: 2px;
  width: 220px;
  height: auto;
  overflow: hidden;
}

.item-img {
  height: auto;
  width: 220px;
  max-height: 280px;
  min-height: 250px;
}

.mr10 {
  margin-right: 4px;
}

.movieTypeSelectItem {
  color: antiquewhite;
  padding: 0;
  margin: 0;

  :hover {
    color: rgba(0, 0, 0, 0.895);
    font-size: large;
  }
}

.text-subtitles {
  height: 6rem;
  padding: 4px;
}

.q-card__section--vert {
  padding: 2px;
}

.tag-popup {
  padding: 12px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 400px;

  .tag-item {
    margin: 2px 4px;
    padding: 1px 6px;
    border-radius: 8px;
  }
}

.page-sticky {
  width: 4rem;
  height: 3rem;
}
</style>
