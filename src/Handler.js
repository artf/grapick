export default class Handler {
  constructor(Grapick, position = 0, color = 'black') {
    Grapick.getHandlers().push(this);
    this.gp = Grapick;
    this.position = position;
    this.color = color;
    this.selected = 0;
  }

  /**
   * Set color
   * @param {string} color Color string, eg. red, #123, 'rgba(30,87,153,1)', etc..
   * @param {Boolean} complete Indicates if the action is complete
   * @example
   * handler.setColor('red');
   */
  setColor(color, complete = 1) {
    this.color = color;
    this.gp.change(complete);
  }

  /**
   * Set color
   * @param {integer} position Position integer in percentage, eg. 20, 50, 100
   * @param {Boolean} complete Indicates if the action is complete
   * @example
   * handler.setPosition(55);
   */
  setPosition(position, complete = 1) {
    this.position = position;
    this.gp.change(complete);
  }

  /**
   * Get color of the handler
   * @return {string} Color string
   */
  getColor() {
    return this.color;
  }

  /**
   * Get position of the handler
   * @return {integer} Position integer
   */
  getPosition() {
    return this.position;
  }

  /**
   * Indicates if the handler is the selected one
   * @return {Boolean}
   */
  isSelected() {
    return !!this.selected;
  }

  /**
   * Get value of the handler
   * @return {string}
   * @example
   * handler.getValue(); // -> `black 0%`
   */
  getValue() {
    return `${this.getColor()} ${this.getPosition()}%`;
  }

  /**
   * Select the current handler and deselect others
   */
  select() {
    const handlers = this.gp.getHandlers();
    handlers.forEach(handler => handler.deselect());
    this.selected = 1;
    const onSelect = this.onHandleSelect;
    onSelect && onSelect(this);
  }

  /**
   * Deselect the current handler
   */
  deselect() {
    this.selected = 0;
    const onDeselect = this.onHandleDeselect;
    onDeselect && onDeselect(this);
  }

  /**
   * Remove the current handler
   * @return {Handler} Removed handler (itself)
   */
  remove() {
    const handlers = this.gp.getHandlers();
    const removed = handlers.splice(handlers.indexOf(this), 1);
    return removed[0];
  }

}
