function wait<T>(duration: number) {
  return new Promise<T>((resolve) => setTimeout(resolve, duration));
}
  
export default wait;
