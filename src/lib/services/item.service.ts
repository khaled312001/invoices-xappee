import { Fetch } from "../actions/fetch";

export const postNewItem = async (newItem: any) => {
  const { ok, data } = await Fetch(`items/update`, {
    method: "PUT",
    body: JSON.stringify({ item:newItem }),
  });
  if (ok) {
    return true;
  }
  return false;
};

export const fetchPaginatedItems = async (page: number) => {
  try {
    if (!page) throw new Error("No page");
    const { ok, data } = await Fetch(`items?page=${page}&pageSize=20`, {
      next: {
        tags: ["initialItems"],
      },
    });

    if (ok) {
      return { items: data.items, nextPage: page + 1 };
    } else {
      return { items: [], nextPage: page };
    }
  } catch (err: any) {
    console.log(err);
  }
};

export const updateItem = async (item: any) => {
  const { ok, data } = await Fetch(`items/update`, {
    method: "PUT",
    body: JSON.stringify({ item }),
  });
  if (ok) {
    return true;
  }
  return false;
};

export const deleteItem = async (_id: string) => {
  const { ok, data } = await Fetch(`items/delete/${_id}`, {});
  if (ok) {
    return true;
  }
  return false;
};

export const fetchSearchItem = async (querySku: string) => {
  const { ok, data } = await Fetch(`items/search/${querySku}`);
  if (ok) {
    return data.item;
  } else {
    return null;
  }
};

export const fetchSearchItemsByName = async (queryName: string) => {
  const { ok, data } = await Fetch(`items/searchname/${queryName}`);
  if (ok) {
    return data.items;
  } else {
    return null;
  }
};

export const postNewItems = async (newItems: any[]) => {
  const { ok, data } = await Fetch(`items/new`, {
    method: "POST",
    body: JSON.stringify({ newItems: newItems }),
  });
  return data.items;
};


