export const sortArray = async (categories) => {
  //   console.log(categories);
  await categories.sort((a, b) => {
    const nameA = a?.categoryName?.toLowerCase();
    console.log(nameA);
    const nameB = b?.categoryName?.toLowerCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
  return categories;
};

export const convertToMB = (size) => {
  let finalSize;
  const divider = 1024 * 1024;
  finalSize = size / divider;

  return finalSize;
};
