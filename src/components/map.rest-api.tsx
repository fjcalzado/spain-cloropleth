export const loadJson = (filePath: string) => {
  fetch(filePath)
    .then((res) => res.json())
    .then((data) => {
      console.log('data:', data);
    });
};
