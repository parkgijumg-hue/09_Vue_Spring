<script setup>
import api from '@/api/boardApi';
import { ref, computed, watch } from 'vue';
import moment from 'moment';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const page = ref({}); //js : page.value, template : page
const amount = 10;
//페이지별로 가지고 온 [json, json]넣을 예정임.
const articles = computed(() => page.value.list || []);
const currentPage = computed(() => Number(route.query.page || 1));
const totalPage = computed(() => page.value.totalPage || 1);
const pageNumbers = computed(() =>
  Array.from({ length: totalPage.value }, (_, index) => index + 1),
);
//[json, json] --> 반복문으로 출력해주면 됨.

//boardApi.js에 만든 api.getList()
const load = async () => {
  try {
    page.value = await api.getList({
      page: currentPage.value,
      amount,
    });
    console.log('컴포넌트의 page.value: ', page.value);
  } catch {
    console.log('게시판 리스트가지고 오면서 에러 발생함.');
  }
};

const movePage = (pageNum) => {
  if (pageNum < 1 || pageNum > totalPage.value || pageNum === currentPage.value) {
    return;
  }

  router.push({
    name: 'board/list',
    query: { page: pageNum, amount },
  });
};

watch(
  () => route.query.page,
  () => load(),
  { immediate: true },
);
</script>

<template>
  <div>
    <h1 class="mb-3"><i class="fa-solid fa-paste"></i> 게시글 목록</h1>
    <table class="table table-striped">
      <thead>
        <tr>
          <th style="width: 60px">No</th>
          <th>제목</th>
          <th style="width: 100px">작성자</th>
          <th style="width: 120px">작성일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.no">
          <td>{{ article.no }}</td>
          <td>
            <router-link
              :to="{ name: 'board/detail', params: { no: article.no } }"
            >
              {{ article.title }}
            </router-link>
          </td>
          <td>{{ article.writer }}</td>
          <td>{{ moment(article.regDate).format('YYYY-MM-DD') }}</td>
        </tr>
      </tbody>
    </table>
    <div class="my-5 d-flex">
      <div class="flex-grow-1 text-center">
        <button
          type="button"
          class="btn btn-outline-primary btn-sm me-1"
          :disabled="currentPage <= 1"
          @click="movePage(currentPage - 1)"
        >
          이전
        </button>
        <button
          v-for="pageNum in pageNumbers"
          :key="pageNum"
          type="button"
          class="btn btn-sm me-1"
          :class="pageNum === currentPage ? 'btn-primary' : 'btn-outline-primary'"
          @click="movePage(pageNum)"
        >
          {{ pageNum }}
        </button>
        <button
          type="button"
          class="btn btn-outline-primary btn-sm"
          :disabled="currentPage >= totalPage"
          @click="movePage(currentPage + 1)"
        >
          다음
        </button>
      </div>
      <div>
        <router-link :to="{ name: 'board/create' }" class="btn btn-primary">
          <i class="fa-solid fa-pen-to-square"></i> 글 작성</router-link
        >
      </div>
    </div>
  </div>
</template>
