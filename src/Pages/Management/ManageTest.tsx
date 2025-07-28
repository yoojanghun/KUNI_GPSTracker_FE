import { useState } from "react";
import { carRegist } from "@/Api/ManageApi/carRegist";
import { carDelete } from "@/Api/ManageApi/carDelete";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { getCarList } from "@/Api/ManageApi/getCarList";

// API 연결 확인용 테스트 페이지

export function ManageTest () {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [vehicleName, setVehicleName] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      const res = await carRegist({ vehicleNumber, vehicleName });
      console.log("등록 성공", res);
      // 등록 성공 후 알림, 모달 닫기, 페이지 이동 등
    } catch (e) {
      console.error("등록 실패", e);
      setError("차량 등록에 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    try {
      await carDelete({vehicleNumber});
      // 등록 성공 후 알림, 모달 닫기, 페이지 이동 등
    } catch (e) {
      console.error("삭제 실패", e);
      setError("차량 삭제에 실패했습니다.");
    }
  };

  const handleGetCar = async () => {
    try {
      const res = await getCarList({page: 1, sort: "vehicleNumber"});
      console.log("데이터 가져오기 성공", res);
      // 등록 성공 후 알림, 모달 닫기, 페이지 이동 등
    } catch (e) {
      console.error("가져오기 실패", e);
      setError("차량 가져오기에 실패했습니다.");
    }
  };

  return (
    <div>
      <Input
        type="text"
        value={vehicleNumber}
        onChange={(e) => setVehicleNumber(e.target.value)}
        placeholder="차량 번호"
      />
      <Input
        type="text"
        value={vehicleName}
        onChange={(e) => setVehicleName(e.target.value)}
        placeholder="차량 이름"
      />
      <br />
      <Button variant={"outline"} onClick={handleSubmit}>등록</Button>
      {error && <p>{error}</p>}
      <br />
      <Button variant={"outline"} onClick={handleDelete}>삭제</Button>
      {error && <p>{error}</p>}
      <br />
      <Button variant={"outline"} onClick={handleGetCar}>리스트 가져오기</Button>
      {error && <p>{error}</p>}
    </div>
  );
}