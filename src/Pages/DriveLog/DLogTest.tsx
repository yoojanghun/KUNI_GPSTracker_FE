import { useState } from "react";
import { getLogList } from "@/Api/LogApi/getLogList";
import { getLogDetail } from "@/Api/LogApi/getLogDetail";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";


// API 연결 확인용 테스트 페이지

export function DLogTest () {
  const [id, setId] = useState<number>(0);
  const [pageable, setPage] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleDetail = async () => {
    try {
      const res = await getLogDetail({id});
      console.log("가져오기 성공", res);
      // 등록 성공 후 알림, 모달 닫기, 페이지 이동 등
    } catch (e) {
      console.error("가져오기 실패", e);
      setError("상세 기록 가져오기에 실패했습니다.");
    }
  };

  const handleList = async () => {
    try {
      const res = await getLogList({pageable});
      console.log("가져오기 성공", res);
      // 등록 성공 후 알림, 모달 닫기, 페이지 이동 등
    } catch (e) {
      console.error("가져오기 실패", e);
      setError("기록 리스트 가져오기에 실패했습니다.");
    }
  };




  return (
    <div>
      <Input
        type="text"
        onChange={(e) => setId(Number(e.target.value))}
        placeholder="상세기록 id"
      />
      <Input
        type="text"
        onChange={(e) => setPage(Number(e.target.value))}
        placeholder="페이지 숫자"
      />
      <br />
      <Button variant={"outline"} onClick={handleDetail}>상세정보</Button>
      {error && <p>{error}</p>}
      <br />
      <Button variant={"outline"} onClick={handleList}>페이지 조회</Button>
      {error && <p>{error}</p>}
    </div>
  );
}