# 📑 ToDo - List
## 👋 프로젝트 소개
- 할일을 관리할 수 있는 투두리스트 토이 프로젝트

- 주요 기능 :   
    회원가입, 로그인, 할일 CRUD, 팀 생성, 멤버 초대 등

## 🙆 프로젝트 멤버
- **FE : 김상우** [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Font_Awesome_5_brands_github.svg/640px-Font_Awesome_5_brands_github.svg.png" width="20px" height="20px" alt="GitHub"></img>](https://github.com/daisyyb)
- **BE : 최희수** [<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Font_Awesome_5_brands_github.svg/640px-Font_Awesome_5_brands_github.svg.png" width="20px" height="20px" alt="GitHub"></img>](https://github.com/HS-01219)

---

# 🌟 모듈 설치
- frontend/backend 폴더 밑에서 각각 실행
 - `web-todo/frontend > npm install`
 - `web-todo/backend > npm install`

---

# ⚙️ 환경 변수 설정
- 이 프로젝트는 '.env' 파일을 필요로 합니다. 깃 허브에 포함되어 있지 않으므로, 개인환경에 맞는 설정이 필요합니다.

- backend 폴더 밑에 생성해주세요.
- 코드 작성 예시

    ```
PORT = 5000
DB_USER = your_database_username
DB_PASSWORD = your_database_password
PRIVATE_KEY = your_jwt_secret_key
```
--- 

# 🚀 START
- FE와 BE를 따로 구동합니다.
 - `web-todo/frontend > npm start`
 - `web-todo/backend > node app.js`
---

# 🍀 FE
## ⛔ 현재 오류 사항
- 내 할일 목록 없음
- 할일 이름 수정 API 호출 없음 (화면단에서만 수정됨)
- 완료 된 일 체크 표시와 취소선 없음
 - 체크가 안되어 있어 다시 체크를 누르면 상태 1로 다시 업데이트
- 할일 등록 시 별도의 ALERT이 없고, 리스트 리프레시가 안됨 (새로고침 후 반영)
- 현재 팀을 클릭할 때마다 멤버 조회 중 -> 팀원 초대할 때만 멤버 조회 필요
- 팀원 초대 시 API 호출 없음

---

# 🍀 BE
##  📖 API 설계 문서
- [Notion-API 설계 문서](https://rang01.notion.site/ToDoList-1b2e94ddcb83806bba35dc4cdff66a8f?pvs=4)
   
## 💡 추후 개선 방향
- ### 구동 방식 개선
 - FE와 BE를 합쳐서 구동할 수 있도록 하겠습니다.

- ### Docker를 이용한 DB세팅 및 배포
 - 로컬에서만 작업이 이루어져 FE와 BE가 각자 DB를 관리해야 하는 점이 아쉬웠습니다. 추후 Docker를 이용해 고도화 해보겠습니다.

- ### JWT 토큰 사용
 - 현재 userId 를 FE에서 넘겨준 뒤 데이터 처리를 하고 있습니다. 토큰을 이용해 HEADER에서 데이터를 받아올 수 있도록 개선할 예정입니다.

 - 현재 세션을 관리하지 않아, 새로고침하면 무조건 로그인 화면으로 돌아가고 있습니다. 세션이 남아있으면 ToDo 페이지에 머물도록 개선할 예정입니다.

