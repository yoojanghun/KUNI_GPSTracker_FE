![alt text](team_logo-1.png)

# GPS Tracker
[![GitHub stars](https://img.shields.io/github/stars/Kernel360/KUNI_GPSTracker_FE?style=social)](https://github.com/Kernel360/KUNI_GPSTracker_FE/stargazers) [![GitHub forks](https://img.shields.io/github/forks/Kernel360/KUNI_GPSTracker_FE?style=social)](https://github.com/Kernel360/KUNI_GPSTracker_FE/network/members) [![GitHub license](https://img.shields.io/github/license/Kernel360/KUNI_GPSTracker_FE)](https://github.com/Kernel360/KUNI_GPSTracker_FE/blob/main/LICENSE) [![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/) [![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)](https://react.dev/) [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)  [![AWS Amplify Status](https://img.shields.io/badge/AWS%20Amplify-Deployed-success?logo=amazon-aws)](https://aws.amazon.com/amplify/) [![Jenkins](https://img.shields.io/badge/Jenkins-Build-blue?logo=jenkins)](https://www.jenkins.io/)
---

## 개요

**서비스 URL:** [https://gps-tracker.store/](https://gps-tracker.store/)  
**개발 기간:** 약 1개월 (2025.07.08 ~ 2025.08.23)  

### 목적
렌트카 및 쉐어링카의 운행 상태를 실시간으로 관리하고 관제하기 위한 통합 차량 관제 플랫폼입니다. 차량별 운행 데이터 수집 및 시각화를 통해 사용자와 관리자의 편의를 돕고, 정확한 운행 기록 기반으로 자동 운행일지 생성 및 차량 관리 효율을 높이고자 합니다.

### 배경
개인 차량 소유보다 공유 차량 사용이 보편화되며, 차량 이용 이력과 운행 데이터를 체계적으로 관리할 필요성이 증가하고 있습니다. 특히 법인 차량의 경우, 사용자별 관리가 어렵고 수동 운행일지 작성에 한계가 존재합니다. 이러한 수요에 맞추어 차량의 위치, 운행 상태 등을 자동으로 수집하고 관리할 수 있는 시스템 구축하였습니다.

### 개발 목표
- 렌터 및 쉐어링 차량 등록 및 GPS 정보 확인 및 실시간 공유  
- 자사에 등록된 차량 관리 및 해당 차량들의 운행 상세정보 확인

---

## 주요 기능

### 로그인 시스템
- JWT 토큰 인증 방식 사용  
![alt text](로그인.png)  

---

### 운행 정보 대시보드 (메인 페이지)
- 현재 보유 중인 차량의 운행 정보를 지도 및 통계자료와 함께 확인할 수 있습니다.  
![alt text](대시보드.gif)  

---

### 위치 조회
- 차량의 실시간 위치를 조회하여 지도 상에 표시하는 기능입니다.  
![alt text](위치조회.gif)  

---

### 차량 관리
- 새로운 차량을 등록하거나 기존 차량 정보를 수정/삭제하는 등, 시스템에 등록된 모든 차량을 효율적으로 관리할 수 있는 페이지입니다.  
- ![alt text](차량관리_메인.png)  
- ![alt text](차량관리_추가.png)  
- ![alt text](차량관리_삭제.png)  

---

### 운행 일지
- 각 차량의 과거 운행 기록을 날짜별, 차량별로 조회하고 관리할 수 있습니다.  
- ![alt text](운행일지_메인.png)  
- ![alt text](운행일지_상세.png)  

---

## 🛠 테크 스택

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

## ⚡ Quick Start
```bash
git clone https://github.com/Kernel360/KUNI_GPSTracker_FE.git
cd KUNI_GPSTracker_FE
npm install
npm run dev
```