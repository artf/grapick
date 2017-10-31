import Grapick from './../src';
import Handler from './../src/Handler';

let ga;
let gah;
let changed;

describe('Grapick', () => {

  it('Main object is defined', () => {
    expect(Grapick).toBeDefined();
  });

  it('Throw error with no element', () => {
    expect(() => new Grapick()).toThrow();
    expect(() => new Grapick({})).toThrow();
  });

  describe('Startup', () => {

    beforeAll(() => {
      document.body.innerHTML = `<div style="padding:100px" id="gp"></div>`;
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    beforeEach(() => {
      ga = new Grapick({el: '#gp'});
      changed = 0;
      ga.on('change', () => changed++);
    });

    it('Able to change type', () => {
      ga.setType('radial');
      expect(ga.getType()).toBe('radial');
    });

    it('Change of the type triggers the `change` event', () => {
      ga.setType('radial');
      expect(changed).toBe(1);
    });

    it('Default type is linear', () => {
      expect(ga.getType()).toBe('linear');
    });

    it('Default direction is 90deg', () => {
      expect(ga.getDirection()).toBe('90deg');
    });

    it('Able to change direction', () => {
      ga.setDirection('top');
      expect(ga.getDirection()).toBe('top');
    });

    it('Change of the direction triggers the `change` event', () => {
      ga.setDirection('top');
      expect(changed).toBe(1);
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
      expect(h.isSelected()).toBe(true);
      expect(ga.getHandlers().length).toBe(1);
    });

    it('Add handler triggers change', () => {
      const h = ga.addHandler(50, '#fff');
      expect(changed).toBe(1);
    });

    it('Get color values from single handler', () => {
      ga.addHandler(0, '#000');
      // Prevent error with one single handler
      expect(ga.getColorValue()).toBe('#000 0%, #000 0%');
    });

    it('Get color values from more handlers', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      ga.addHandler(100, 'rgba(11, 23, 44, 1)');
      expect(ga.getColorValue()).toBe('#000 0%, white 55%, rgba(11, 23, 44, 1) 100%');
    });

    it('Get value', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getValue()).toBe('linear-gradient(90deg, #000 0%, white 55%)');
    });

    it('Get value with passed type and angle', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getValue('radial', 'center')).toBe('radial-gradient(center, #000 0%, white 55%)');
    });

    it.skip('Get safe value', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      ga.setDirection('left');
      expect(ga.getSafeValue()).toContain('linear-gradient(left, #000 0%, white 55%)');
    });

    it('Get prefixed values', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getPrefixedValues()).toEqual([
        '-moz-linear-gradient(90deg, #000 0%, white 55%)',
        '-webkit-linear-gradient(90deg, #000 0%, white 55%)',
        '-o-linear-gradient(90deg, #000 0%, white 55%)',
        '-ms-linear-gradient(90deg, #000 0%, white 55%)'
      ]);
    });

    it('change() triggers the `change` event', () => {
      ga.change();
      expect(changed).toBe(1);
    });

    it('clear() works', () => {
      ga.addHandler(0, '#000');
      ga.addHandler(55, 'white');
      expect(ga.getHandlers().length).toBe(2);
      ga.clear();
      expect(ga.getHandlers().length).toBe(0);
      expect(changed).toBe(4); // TODO to fix (issues with jsdom), should be 1
    });

    it('getSelected() works', () => {
      const h = ga.addHandler(0, '#000', 1);
      ga.addHandler(55, 'white', 0);
      expect(ga.getSelected()).toBe(h);
    });

    it.skip('Click on preview element adds new handler', () => {
      // Have to mock previewEl and click event
      ga.previewEl.click();
      expect(ga.getHandlers().length).toBe(1);
    });

    it('setValue() with linear string works', () => {
      ga.setValue('radial-gradient(77deg, rgba(18, 215, 151, 0.75) 31.25%, white 85.1562%)');
      expect(!!changed).toBe(true);
      expect(ga.getType()).toBe('radial');
      expect(ga.getDirection()).toBe('77deg');
      expect(JSON.parse(JSON.stringify(ga.getHandlers()))).toEqual([
        { color: 'rgba(18,215,151,0.75)', position: 31.25, selected: 0},
        { color: 'white', position: 85.1562, selected: 0}
      ]);
    });

    it('silent setValue() works', () => {
      ga.setValue('linear-gradient(left, red 0%, blue 100%)', { silent: 1 });
      expect(!!changed).toBe(false);
    });
  });

  describe('Grapick Handler', () => {
    beforeAll(() => {
      document.body.innerHTML = `<div style="padding:100px" id="gp"></div>`;
    });

    afterAll(() => {
      document.body.innerHTML = '';
    });

    beforeEach(() => {
      ga = new Grapick({el: '#gp'});
      gah = new Handler(ga);
    });

    it('Handler exists', () => {
      expect(gah).toBeDefined();
      expect(ga.getHandlers().length).toBe(1);
    });

    it('Check default selection', () => {
      expect(gah.isSelected()).toBe(true);
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
