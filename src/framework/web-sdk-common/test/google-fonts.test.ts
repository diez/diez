import {GoogleFont, GoogleFontCollection} from '../src/google-fonts';

describe('GoogleFont', () => {
  test('variations and hashes', () => {
    const font = new GoogleFont('Source Code Pro');
    font.setVariation({style: 'normal', weight: 400});
    expect(font.hash()).toEqual('Source+Code+Pro:400normal');

    font.setVariation({style: 'italic', weight: 800});
    font.setVariation({style: 'normal', weight: 800});
    expect(font.hash()).toEqual('Source+Code+Pro:400normal,800italic,800normal');
  });
});

describe('GoogleFontCollection', () => {
  test('#url', () => {
    const collection = new GoogleFontCollection();
    collection.set('Source Code Pro', {weight: 100, style: 'normal'});
    collection.set('Source Code Pro', {weight: 500, style: 'italic'});
    collection.set('Montserrat', {weight: 300, style: 'italic'});

    expect(collection.url).toEqual('https://fonts.googleapis.com/css?family=Source+Code+Pro:100normal,500italic%7CMontserrat:300italic&swap=true');
  });
});
