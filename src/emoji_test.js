{
  function toCodePoints(unicodeSurrogates) {
    const points = [];
    let char = 0;
    let previous = 0;
    let i = 0;
    while(i < unicodeSurrogates.length) {
      char = unicodeSurrogates.charCodeAt(i++);
      if(previous) {
        points.push((0x10000 + ((previous - 0xd800) << 10) + (char - 0xdc00)).toString(16));
        previous = 0;
      } else if(char > 0xd800 && char <= 0xdbff) {
        previous = char;
      } else {
        points.push(char.toString(16));
      }
    }

    if(points.length && points[0].length === 2) {
      points[0] = '00' + points[0];
    }

    return points;
  }

  const eye = '👁‍🗨';
  toCodePoints(eye)

  function ccc(str) {
    return str.split('').map(c => c.charCodeAt(0).toString(16));
  }

  ccc('🏳️‍🌈')
  ccc('🏋️‍♀️');
  '🏌‍♀';

  const regexp = new RegExp('(?:👨🏻‍🤝‍👨�[�-�]|👨🏼‍🤝‍👨�[��-�]|👨🏽‍🤝‍👨�[����]|👨🏾‍🤝‍👨�[�-��]|👨🏿‍🤝‍👨�[�-�]|👩🏻‍🤝‍👨�[�-�]|👩🏻‍🤝‍👩�[�-�]|👩🏼‍🤝‍👨�[��-�]|👩🏼‍🤝‍👩�[��-�]|👩🏽‍🤝‍👨�[����]|👩🏽‍🤝‍👩�[����]|👩🏾‍🤝‍👨�[�-��]|👩🏾‍🤝‍👩�[�-��]|👩🏿‍🤝‍👨�[�-�]|👩🏿‍🤝‍👩�[�-�]|🧑🏻‍🤝‍🧑�[�-�]|🧑🏼‍🤝‍🧑�[�-�]|🧑🏽‍🤝‍🧑�[�-�]|🧑🏾‍🤝‍🧑�[�-�]|🧑🏿‍🤝‍🧑�[�-�]|🧑‍🤝‍🧑|👫�[�-�]|👬�[�-�]|👭�[�-�]|�[�-�])|(?:�[��]|🧑)(?:�[�-�])?‍(?:⚕|⚖|✈|�[���������]|�[������]|�[�-���])|(?:�[��]|�[��]|⛹)((?:�[�-�])‍[♀♂])|(?:�[���]|�[����������-������-�]|�[���-������-��-�])(?:�[�-�])?‍[♀♂]|(?:👨‍❤️‍💋‍👨|👨‍👨‍👦‍👦|👨‍👨‍👧‍�[��]|👨‍👩‍👦‍👦|👨‍👩‍👧‍�[��]|👩‍❤️‍💋‍�[��]|👩‍👩‍👦‍👦|👩‍👩‍👧‍�[��]|👨‍❤️‍👨|👨‍👦‍👦|👨‍👧‍�[��]|👨‍👨‍�[��]|👨‍👩‍�[��]|👩‍❤️‍�[��]|👩‍👦‍👦|👩‍👧‍�[��]|👩‍👩‍�[��]|🏳️‍⚧|🏳️‍🌈|🏴‍☠|🐕‍🦺|🐻‍❄|👁‍🗨|👨‍�[��]|👩‍�[��]|👯‍♀|👯‍♂|🤼‍♀|🤼‍♂|🧞‍♀|🧞‍♂|🧟‍♀|🧟‍♂|🐈‍⬛)|[#*0-9]️?⃣|(?:[©®™♟])|(?:�[�����������-������-������-����]|�[���������-���-�������-��-��-���������-��-����]|[‼⁉ℹ↔-↙↩↪⌚⌛⌨⏏⏭-⏯⏱⏲⏸-⏺Ⓜ▪▫▶◀◻-◾☀-☄☎☑☔☕☘☠☢☣☦☪☮☯☸-☺♀♂♈-♓♠♣♥♦♨♻♿⚒-⚗⚙⚛⚜⚠⚡⚧⚪⚫⚰⚱⚽⚾⛄⛅⛈⛏⛑⛓⛔⛩⛪⛰-⛵⛸⛺⛽✂✈✉✏✒✔✖✝✡✳✴❄❇❗❣❤➡⤴⤵⬅-⬇⬛⬜⭐⭕〰〽㊗㊙])(?:(?!︎))|(?:(?:�[��]|�[���]|[☝⛷⛹✌✍])(?:(?!︎))|(?:�[��-���]|�[���-��-���-���-��-������-��-���-���]|�[���-�����-����������-��-�]|[✊✋]))(?:�[�-�])?|(?:🏴󠁧󠁢󠁥󠁮󠁧󠁿|🏴󠁧󠁢󠁳󠁣󠁴󠁿|🏴󠁧󠁢󠁷󠁬󠁳󠁿|🇦�[�-������-����]|🇧�[���-��-��-�����]|🇨�[����-��-���-�]|🇩�[�������]|🇪�[������-�]|🇫�[�-����]|🇬�[���-��-��-���]|🇭�[������]|🇮�[�-��-��-�]|🇯�[����]|🇰�[��-��������]|🇱�[�-����-��]|🇲�[��-��-�]|🇳�[���-��������]|🇴🇲|🇵�[��-��-��-���]|🇶🇦|🇷�[�����]|🇸�[�-��-��-���-�]|🇹�[����-��-������]|🇺�[�������]|🇻�[�������]|🇼�[��]|🇽🇰|🇾�[��]|🇿�[���]|�[���-��-���-��-����-��-��-��-��-��-������-��-���-�]|�[�-�����-����-��-���-��-��-��-��-���-��-��-��-��-��-��-��-����-��-�]|�[���-���-��-����-��-���-����-���-��-��-��-��-��-��-��-�]|[⏩-⏬⏰⏳♾⛎✅✨❌❎❓-❕➕-➗➰➿])|️')
}