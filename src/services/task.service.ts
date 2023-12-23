import FetchService from "./request/FetchService";

const fetchService = new FetchService({
  baseURL: "/webapi",
});

export async function fetchGetTask() {
  return await fetchService.get({
    url: "/task",
  });
}

export async function fetchPostTask(data: any) {
  return await fetchService.post({
    url: "/task",
    body: data,
  });
}

export async function fetchPutTask(id: string, data: any) {
  return await fetchService.put({
    url: "/task/" + id,
    body: data,
  });
}
