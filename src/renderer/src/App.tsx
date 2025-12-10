import { JSX } from 'react'
import InputArea from '@renderer/components/InputArea'
import Canvas from '@renderer/components/Canvas'
import ControlPanel from '@renderer/components/ControlPanel'
import HistoryPanel from '@renderer/components/HistoryPanel'
import SaveIndicator from '@renderer/components/SaveIndicator'
import { ToastContainer } from '@renderer/components/Toast'
import { useAppController } from './hooks/useAppController'

function App(): JSX.Element {
  const {
    input,
    setInput,
    qrContent,
    onQRReady,
    settings,
    updateSetting,
    history,
    selectedId,
    saveStatus,
    onSelectHistory,
    clearHistory,
    toasts,
    removeToast,
    onGenerate
  } = useAppController()

  return (
    <section className="h-screen w-screen bg-zinc-800 flex flex-col overflow-hidden">
      <InputArea
        value={input}
        onChange={setInput}
        onGenerate={onGenerate}
        disabled={!input.trim()}
      />
      <div className="flex w-full h-full flex-1">
        <HistoryPanel
          history={history}
          onSelect={onSelectHistory}
          selectedId={selectedId}
          onClear={clearHistory}
        />
        <div className="flex-1 relative">
          <Canvas data={qrContent} settings={settings} onQRReady={onQRReady} />
          <SaveIndicator status={saveStatus} />
        </div>
        <ControlPanel settings={settings} onSettingChange={updateSetting} />
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </section>
  )
}

export default App
