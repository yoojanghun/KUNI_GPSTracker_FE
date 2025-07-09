import { useState } from "react";
import { Button } from "@/Components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/Components/ui/dialog"
import { Input } from "@/Components/ui/input"
import { Label } from "@/Components/ui/label"
import { Plus } from "lucide-react"

export function AddCarButton({ text="차량 등록" } : {text?: String | null}) {
  const [openFirst, setOpenFirst] = useState(false);
  const [openSecond, setOpenSecond] = useState(false);
  const [carNum, setCarNum] = useState("");
  const [modelName, setModelName] = useState("");

  return (
    <>
      <Dialog open={openFirst} onOpenChange={setOpenFirst}>
        <form>
          <DialogTrigger asChild>
            <Button
              className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
              onClick={() => setOpenFirst(true)}
            >
              <Plus strokeWidth={3} size={20}/>{text}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>신규차량 등록하기</DialogTitle>
              <DialogDescription>
                새 차량을 등록하기 위해 아래의 정보를 입력해 주세요
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="carNum">차량 번호</Label>
                <Input 
                  id="carNum" 
                  name="carNum" 
                  placeholder="예: 34나3434" 
                  className="placeholder:text-[#ACACAC]" 
                  value={carNum}
                  onChange={(e) => setCarNum(e.target.value)}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="modelName">차량명</Label>
                <Input
                 id="modelName" 
                 name="modelName" 
                 placeholder="예: Genesis GV80" 
                 className="placeholder:text-[#ACACAC]"
                 value={modelName}
                 onChange={(e) => setModelName(e.target.value)}
                 />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
                onClick={() => {
                  setOpenFirst(false);
                  setOpenSecond(true);
                }}
              >
                입력 완료
              </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <Dialog open={openSecond} onOpenChange={setOpenSecond}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>차량 정보를 확인해 주세요</DialogTitle>
            <DialogDescription>
              <ul>
                <li>차량 번호: {carNum}</li>
                <li>차량명: {modelName}</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
              onClick={() => {
                setOpenSecond(false);
                setOpenFirst(true);
              }}
            >
              다시 입력
            </Button>
            <DialogClose>
              <Button
               type="submit" 
               className="bg-[#8D99FF] gap-3 hover:bg-[#8D99FF]/80"
               onClick={()=>{}}>등록</Button>
            </DialogClose>
            
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
