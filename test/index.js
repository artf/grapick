import {Grapick, Handler} from './../src';

let ga;
let gah;

describe('Grapick', () => {

  it('Main object is defined', () => {
    expect(Grapick).toBeDefined();
  });

  describe('Startup', () => {

    beforeEach(() => {
      ga = new Grapick();
    });

    it('Default type is linear', () => {
      expect(ga.getType()).toBe('linear');
    });

    it('Able to change type', () => {
      ga.setType('radial');
      expect(ga.getType()).toBe('radial');
    });

    it('Default direction is left', () => {
      expect(ga.getDirection()).toBe('left');
    });

    it('Able to change direction', () => {
      ga.setDirection('top');
      expect(ga.getDirection()).toBe('top');
    });

    it('Has no handlers', () => {
      expect(ga.getHandlers().length).toBe(0);
    });

    it('Return undefined handler', () => {
      expect(ga.getHandler(0)).toBeUndefined();
    });

    it('Add handler', () => {
      const h = ga.addHandler(50, '#fff');
      expect(h).toBeDefined();
      expect(h instanceof Handler).toBe(true);
      expect(h.getColor()).toBe('#fff');
      expect(h.isSelected()).toBe(false);
      expect(ga.getHandlers().length).toBe(1);
    });
  });

  describe('Grapick Handler', () => {
    beforeEach(() => {
      ga = new Grapick();
      gah = new Handler(ga);
    });

    it('Handler exists', () => {
      expect(gah).toBeDefined();
      expect(ga.getHandlers().length).toBe(1);
    });

    it('Check default selection', () => {
      expect(gah.isSelected()).toBe(false);
    });

    it('Check default position', () => {
      expect(gah.getPosition()).toBe(0);
    });

    it('Check default color', () => {
      expect(gah.getColor()).toBe('black');
    });

    it('Check default value', () => {
      expect(gah.getValue()).toBe('black 0%');
    });

    it('Able to change color', () => {
      gah.setColor('red');
      expect(gah.getColor()).toBe('red');
    });

    it('Able to change position', () => {
      gah.setPosition(55);
      expect(gah.getPosition()).toBe(55);
    });

    it('Able to select', () => {
      gah.select();
      expect(gah.isSelected()).toBe(true);
    });

    it('Able to deselect', () => {
      gah.select();
      expect(gah.isSelected()).toBe(true);
      gah.deselect();
      expect(gah.isSelected()).toBe(false);
    });

    it('Able to remove', () => {
      const handler = gah.remove();
      expect(ga.getHandlers().length).toBe(0);
      expect(handler).toBe(gah);
    });

    it('Able to change pos', () => {
      expect(gah).toBeDefined();
    });
  })

});
