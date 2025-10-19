<script setup lang="ts">
import ShadowTeleport from './components/ShadowTeleport.vue';

const obj2url = (url: string | URL, query: any): string => {
  const u = new URL(url, location.origin);
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined) return;
    u.searchParams.set(k, String(v));
  });
  return u.toString();
};
const obj2usp = (obj: any): URLSearchParams => {
  const usp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    usp.set(k, String(v));
  });
  return usp;
};

interface FansItem {
  mid: number;
}
const getFans = async (): Promise<FansItem[]> => {
  return fetch(
    obj2url(
      'https://api.bilibili.com/x/relation/fans?pn=1&ps=24&gaia_source=main_web',
      {
        vmid: location.pathname.split('/')[1],
      }
    ),
    {
      credentials: 'include',
    }
  )
    .then((r) => r.json())
    .then((r) => r.data?.list || []);
};

const removeFan = async (mid: number): Promise<void> => {
  await fetch(
    'https://api.bilibili.com/x/relation/modify?statistics=%7B%22appId%22:100,%22platform%22:5%7D&x-bili-device-req-json=%7B%22platform%22:%22web%22,%22device%22:%22pc%22,%22spmid%22:%22333.1387%22%7D',
    {
      credentials: 'include',
      method: 'POST',
      body: obj2usp({
        fid: mid,
        act: 7,
        re_src: 11,
        gaia_source: 'web_main',
        spmid: '333.1387',
        extend_content: JSON.stringify({ entity: 'user', entity_id: mid }),
        is_from_frontend_component: true,
        csrf: (await cookieStore.get('bili_jct'))?.value,
      }),
    }
  );
};
const handler = async () => {
  const users = await getFans();
  if (users.length === 0) {
    setTimeout(() => window.alert('没有粉丝了'));
    return;
  }
  for (const user of users) {
    await removeFan(user.mid);
  }
  await new Promise((r) => setTimeout(r, 500));
  location.reload();
};
</script>
<template>
  <ShadowTeleport
    to=".fans-main-title"
    style="display: inline-flex; margin-left: 24px"
  >
    <div @click="handler" class="cursor-pointer text-xl text-blue-400">
      移除全部粉丝
    </div>
  </ShadowTeleport>
</template>
