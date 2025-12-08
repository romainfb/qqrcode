import InputArea from "@renderer/components/InputArea";
import ControlPanel from "@renderer/components/ControlPanel";
import Canvas from "@renderer/components/Canvas";

function App(): React.JSX.Element {
  return (
    <>
      <section className={"h-screen w-screen bg-red-200 flex flex-col overflow-hidden"}>

        <InputArea />
        <div className={"flex w-full h-full flex-1 bg-yellow-300"}>
          <Canvas />
          <ControlPanel />
        </div>

      </section>
    </>
  )
}

export default App
