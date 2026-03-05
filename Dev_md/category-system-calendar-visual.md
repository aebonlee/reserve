# 카테고리 시스템 + 달력 비주얼 개선

## 작업일: 2026-03-05

## 개요
카테고리를 고정 5종으로 구분하고, 달력에서 카테고리별 색상 + 5시간 이상 예약불가 날짜를 빨간 배경으로 시각적으로 표현.

---

## 카테고리 정의

| 카테고리 | CSS class | 배경색 | 텍스트색 |
|---------|-----------|--------|---------|
| 대학강의 | `cat-university` | `#DBEAFE` | `#1E40AF` |
| 기업 대면강의 | `cat-corp-offline` | `#DCFCE7` | `#166534` |
| 기업 온라인강의 | `cat-corp-online` | `#EDE9FE` | `#5B21B6` |
| 특강 - 대면 | `cat-special-offline` | `#FEF3C7` | `#92400E` |
| 특강 - 온라인 | `cat-special-online` | `#FCE7F3` | `#9D174D` |

---

## 수정/생성 파일 목록

### 새 파일
- `src/utils/categories.js` - 카테고리 상수 배열, CSS 클래스 매핑 유틸리티

### 수정된 파일
1. **`src/utils/translations.js`** - ko/en 카테고리 번역 키 5개 추가
2. **`src/styles/schedule.css`** - 카테고리 배지/dot/필터 색상, date-full 빨간 배경, 다크모드 대응
3. **`src/components/schedule/CalendarView.jsx`** - dot에 카테고리 CSS 적용, dailyHours props로 date-full 클래스 적용
4. **`src/components/schedule/ScheduleCard.jsx`** - 카테고리 배지에 색상 클래스 적용
5. **`src/components/schedule/ScheduleForm.jsx`** - 카테고리 자유입력 -> 드롭다운(select) 변경
6. **`src/pages/Schedule.jsx`** - getDailyScheduleHours 호출, CalendarView에 dailyHours 전달, 필터 버튼 카테고리 색상
7. **`src/pages/ScheduleDetail.jsx`** - 카테고리 배지에 색상 클래스 적용
8. **`src/components/lectureRequest/LectureRequestForm.jsx`** - 카테고리 자유입력 -> 드롭다운 변경

---

## 구현 상세

### 1. `src/utils/categories.js`
- `CATEGORIES`: 5개 카테고리 객체 배열 (`key`, `label`, `cssClass`)
- `CATEGORY_LABELS`: 한글 라벨 문자열 배열
- `getCategoryClass(label)`: 카테고리 라벨 -> CSS 클래스 반환

### 2. 달력 비주얼
- **카테고리 dot**: `calendar-dot-marker`에 `cat-*` 클래스 추가하여 카테고리별 색상 표시
- **5시간 이상 예약불가**: `calendar-cell.date-full` 클래스 → `rgba(239, 68, 68, 0.12)` 빨간 배경
- `dailyHours` prop을 CalendarView에 전달하여 각 날짜의 총 시간 확인

### 3. 카테고리 필터 버튼
- 고정 5개 카테고리 + "전체" 버튼 항상 표시
- 활성 시 해당 카테고리 색상으로 표시 (기존: 모두 파랑)

### 4. 다크모드
- 카테고리 배지: 어두운 배경 + 밝은 텍스트
- date-full: 투명도 높인 빨간 배경
- 달력 dot: 밝은 색상 사용

---

## 기존 데이터 마이그레이션 SQL
```sql
UPDATE schedules SET category = '대학강의' WHERE category IS NULL OR category = '';
```

---

## 빌드 결과
- `npm run build` 성공 (3.61s)
- 에러 없음
