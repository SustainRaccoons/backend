async function main() {
  console.log("World");
  console.log(await fetch("https://nav.lv").then(v => v.text()));
}

main()
      .catch(console.error);
console.log("Hello");
