import {FontStyle} from '@diez/prefabs';
import {GoogleFont, GoogleFontCollection} from '../src/google-fonts';

describe('GoogleFont', () => {
  test('variations and hashes', () => {
    const font = new GoogleFont('Source Code Pro');
    font.addVariant({style: FontStyle.Normal, weight: 400});
    expect(font.hash()).toEqual('Source+Code+Pro:400normal');

    font.addVariant({style: FontStyle.Italic, weight: 800});
    font.addVariant({style: FontStyle.Normal, weight: 800});
    expect(font.hash()).toEqual('Source+Code+Pro:400normal,800italic,800normal');
  });
});

describe('GoogleFontCollection', () => {
  test('#url', () => {
    const collection = new GoogleFontCollection();
    collection.set('Source Code Pro', {weight: 100, style: FontStyle.Normal});
    collection.set('Source Code Pro', {weight: 500, style: FontStyle.Italic});
    collection.set('Montserrat', {weight: 300, style: FontStyle.Italic});

    expect(collection.url).toEqual(
      'https://fonts.googleapis.com/css?family=Source+Code+Pro:100normal,500italic%7CMontserrat:300italic&swap=true',
    );
  });
});
