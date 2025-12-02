# Metaddesign 포팅 가이드

현재 환경에서는 외부 Git 저장소(`https://github.com/sangjinoh/metaddesign.git`)에 직접 접근할 수 없습니다. 아래 절차는 메타드디자인 프로젝트 자산(HTML/CSS/JS/이미지)을 수동으로 확보해 `salesDashboard`에 포팅하기 위한 단계입니다.

## 준비물
- 메타드디자인 저장소의 전체 소스 압축본(zip) 또는 수동으로 저장한 HTML/CSS/JS/이미지 파일
- `SalesViewer` WebApi가 실행 중인 로컬/원격 주소 (기존 `scripts/tools.js`의 `baseApiUrl` 설정과 동일하게 사용)

## 포팅 절차
1. **디자인 자산 복사**
   - `metaddesign` 저장소에서 `index.html`, 전역 스타일(CSS), 스크립트(JS), 이미지(logo 및 아이콘 포함)를 추출합니다.
   - 자산을 `SalesDashboard/` 하위에 다음과 같이 배치합니다.
     - HTML: 기존 `index.html`을 백업 후 메타드디자인 HTML 구조로 교체
     - CSS: `SalesDashboard/css/metaddesign/` 등에 보관하고, `index.html`에서 로드하도록 경로 수정
     - JS: `SalesDashboard/scripts/metaddesign/` 등에 추가
     - 이미지: `SalesDashboard/Images/metaddesign/` 등에 추가

2. **데이터 연동 코드 적용**
   - 메타드디자인에서 사용 중인 데이터 바인딩/호출 코드를 확인해 `SalesDashboard/scripts/tools.js` 또는 신규 JS 모듈로 옮깁니다.
   - API 호출 경로는 기존 `baseApiUrl`을 재사용하거나 필요 시 `config.js` 등에서 주입 가능하도록 만듭니다.

3. **레이아웃/반응형 처리**
   - 메타드디자인의 레이아웃이 데스크톱/태블릿/모바일을 모두 지원하는지 확인 후, 기존 `css/site.css`, `css/phone.css`와 충돌하지 않도록 네임스페이스를 분리합니다.
   - 화면 크기 전환 로직(`scripts/tools.js`의 `paletteHelper` 및 `getScreenSize` 로직)을 메타드디자인 마크업에 맞게 조정합니다.

4. **빌드 및 테스트**
   - 로컬에서 `SalesViewer` WebApi를 실행하거나 `scripts/tools.js`의 `baseApiUrl`을 데모 서버로 지정합니다.
   - `index.html`을 로컬 서버(IIS Express, `http-server` 등)로 열어 UI가 메타드디자인과 동일하게 표시되는지 확인합니다.
   - 크롬 개발자 도구의 디바이스 모드를 사용해 데스크톱/태블릿/모바일 뷰를 확인하고, 필요한 CSS media query를 조정합니다.

## 추가 제안
- 메타드디자인이 빌드 도구(webpack, gulp 등)를 사용한다면 동일한 빌드 파이프라인을 `SalesDashboard`에 추가해 정적 자산을 번들링할 수 있습니다.
- 디자인 자산을 수령하면 위 단계를 따라 통합한 뒤, 스타일 충돌 및 데이터 연동 테스트를 진행하세요.

