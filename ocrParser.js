export function parseKakaoOCRWithAlternatingPattern(ocrJson, imageWidth) {
  const fields = ocrJson.images[0].fields;

  // 1. y좌표 기준 정렬
  const sortedFields = [...fields].sort(
    (a, b) => a.boundingPoly.vertices[0].y - b.boundingPoly.vertices[0].y
  );

  // 2. 이름 추출
  const possibleName = sortedFields.find(
    f =>
      f.inferText.length >= 2 &&
      f.inferText.length <= 4 &&
      /^[가-힣]+$/.test(f.inferText)
  );
  const otherName = possibleName ? possibleName.inferText : '상대방';

  const imageMidX = imageWidth / 2;

  const lineGroups = [];
  let currentGroup = [];
  let lastY = null;

  for (const field of sortedFields) {
    const y = field.boundingPoly.vertices[0].y;

    if (lastY !== null && Math.abs(y - lastY) > 15) {
      if (currentGroup.length > 0) lineGroups.push(currentGroup);
      currentGroup = [];
    }

    const x0 = field.boundingPoly.vertices[0].x;
    const x1 = field.boundingPoly.vertices[1].x;
    const midX = (x0 + x1) / 2;
    currentGroup.push({ text: field.inferText, midX });
    lastY = y;
  }
  if (currentGroup.length > 0) lineGroups.push(currentGroup);

  // 4. 시간인지 판별하는 정규식
  const timeRegex = /(오전|오후)?\s?\d{1,2}:\d{2}/;

  // 5. 대화 분석
  const dialogues = [];
  let lastSpeaker = null;
  let lastName = null;

  for (const group of lineGroups) {
    const combinedText = group.map(g => g.text).join(' ').trim();
    const isTime = timeRegex.test(combinedText);

    if (isTime) {
      // 시간은 마지막 화자의 speaker, name을 따라감
      if (lastSpeaker && lastName) {
        dialogues.push({
          speaker: lastSpeaker,
          name: lastName,
          text: combinedText,
          isTime: true
        });
      }
    } else {
      // 말풍선의 중간 좌표 평균으로 화자 판단
      const avgMidX = group.reduce((sum, g) => sum + g.midX, 0) / group.length;
      const speaker = avgMidX < imageMidX ? '너' : '나';
      const name = speaker === '나' ? '나' : otherName;

      dialogues.push({
        speaker,
        name,
        text: combinedText,
        isTime: false
      });

      // 현재 speaker를 시간용으로 기억해둠
      lastSpeaker = speaker;
      lastName = name;
    }
  }

  return dialogues;
}
