import FetchService from "./request/FetchService";

const fetchService = new FetchService({
  baseURL: "/webapi",
});

export async function fetchPostAuthLogin(data: any) {
  return await fetchService.post({
    url: "/user/auth",
    body: data,
  });
}

export async function fetchPostCreateUser(data: any) {
  return await fetchService.post({
    url: "/user",
    body: data,
  });
}

export async function fetchGetUsers() {
  return await fetchService.get({
    url: "/user",
  });
}
