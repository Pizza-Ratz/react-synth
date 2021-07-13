export default () => {
  this.next = x => console.warn('next not implemented')
  this.error = err => console.error('Observer got an error: ' + err)
  this.complete = () => console.log('Observer got a complete notification')

  return this
};