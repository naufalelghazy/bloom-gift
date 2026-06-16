'use client';

import { AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGiftEditor } from './creator/useGiftEditor';

// Step components
import ThemeMusicStep from './creator/steps/ThemeMusicStep';
import SecurityStep from './creator/steps/SecurityStep';
import IntroStep from './creator/steps/IntroStep';
import ContentStep from './creator/steps/ContentStep';
import BouquetStep from './creator/steps/BouquetStep';
import PublishStep from './creator/steps/PublishStep';

// Layout components
import PhonePreview from './creator/PhonePreview';
import RestoreDraftModal from './creator/RestoreDraftModal';
import FullscreenPreviewModal from './creator/FullscreenPreviewModal';

export default function CreatorStudio() {
  const editor = useGiftEditor();

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col md:flex-row text-stone-800">

      {/* LEFT COLUMN: The Wizard Editor */}
      <div className="w-full md:w-[60%] p-6 md:p-12 overflow-y-auto max-h-screen flex flex-col justify-between">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">Bloom Gift Studio 🌸</h1>
            <p className="text-stone-500 text-xs mt-1">Rangkai hadiah digital kejutanmu</p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {editor.isDraftSaved && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Draf disimpan
                </span>
              )}
            </AnimatePresence>
            <span className="text-xs font-semibold px-3 py-1 bg-rose-100 text-rose-600 rounded-full select-none">
              Langkah {editor.currentStep} dari 6
            </span>
          </div>
        </div>

        {/* Wizard Form Sections */}
        <div className="flex-1 space-y-6">

          {editor.currentStep === 1 && (
            <ThemeMusicStep
              giftData={editor.giftData}
              setGiftData={editor.setGiftData}
              updateTheme={editor.updateTheme}
              updateCustomColor={editor.updateCustomColor}
              handleMusicUpload={editor.handleMusicUpload}
              isMusicUploading={editor.isMusicUploading}
              uploadedMusicName={editor.uploadedMusicName}
            />
          )}

          {editor.currentStep === 2 && (
            <SecurityStep
              giftData={editor.giftData}
              updateSecurity={editor.updateSecurity}
            />
          )}

          {editor.currentStep === 3 && (
            <IntroStep
              giftData={editor.giftData}
              updateIntro={editor.updateIntro}
            />
          )}

          {editor.currentStep === 4 && (
            <ContentStep
              giftData={editor.giftData}
              setGiftData={editor.setGiftData}
              updateTheme={editor.updateTheme}
              handleContentChange={editor.handleContentChange}
              addContentItem={editor.addContentItem}
              removeContentItem={editor.removeContentItem}
              handleImageUpload={editor.handleImageUpload}
              isUploading={editor.isUploading}
              updateConfessionField={editor.updateConfessionField}
            />
          )}

          {editor.currentStep === 5 && (
            <BouquetStep
              giftData={editor.giftData}
              updateFinale={editor.updateFinale}
            />
          )}

          {editor.currentStep === 6 && (
            <PublishStep
              giftData={editor.giftData}
              saveLocation={editor.saveLocation}
              setIsPublished={editor.setIsPublished}
              setCurrentStep={editor.setCurrentStep}
            />
          )}

        </div>

        {/* Footer Navigation Buttons */}
        {!editor.isPublished && (
          <div className="flex items-center justify-between border-t border-stone-200 pt-6 mt-8">
            <button
              onClick={() => editor.setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={editor.currentStep === 1}
              className={`flex items-center gap-1 py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                editor.currentStep === 1
                  ? 'opacity-30 border-transparent text-stone-400 cursor-not-allowed'
                  : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-600'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Kembali
            </button>

            {editor.currentStep < 5 ? (
              <button
                onClick={() => editor.setCurrentStep((prev) => Math.min(5, prev + 1))}
                className="flex items-center gap-1 py-2.5 px-5 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-xl transition"
              >
                Lanjut <ChevronRight className="w-4 h-4" />
              </button>
            ) : editor.currentStep === 5 ? (
              <button
                onClick={() => editor.setCurrentStep(6)}
                className="flex items-center gap-1 py-2.5 px-5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-rose-100"
              >
                Lanjut ke Terbitkan <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full sm:w-[70%] md:w-[50%]">
                <input
                  type="text"
                  placeholder="slug-kado (e.g. kado-nara)"
                  value={editor.giftData.slug}
                  onChange={(e) => editor.handleSlugChange(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl focus:outline-none text-xs ${
                    editor.slugError ? 'border-red-400 focus:ring-red-200' : 'border-stone-200 focus:ring-rose-200'
                  }`}
                />
                <button
                  onClick={editor.handlePublish}
                  disabled={editor.isSubmitting}
                  className="flex-shrink-0 py-2.5 px-5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition shadow-md shadow-rose-100 disabled:opacity-50"
                >
                  {editor.isSubmitting ? 'Mengirim...' : 'Terbitkan 🚀'}
                </button>
              </div>
            )}
          </div>
        )}

        {editor.slugError && (
          <p className="text-red-500 text-xs font-semibold mt-2 text-right">{editor.slugError}</p>
        )}

      </div>

      {/* RIGHT COLUMN: The Sticky Phone Mockup Live Preview */}
      <PhonePreview
        giftData={editor.giftData}
        previewKey={editor.previewKey}
        currentStep={editor.currentStep}
        restartPreview={editor.restartPreview}
        setIsFullscreenPreview={editor.setIsFullscreenPreview}
      />

      {/* Modals */}
      <RestoreDraftModal
        show={editor.showRestorePrompt}
        onRestore={editor.handleRestoreDraft}
        onDiscard={editor.handleDiscardDraft}
      />

      <FullscreenPreviewModal
        show={editor.isFullscreenPreview}
        onClose={() => editor.setIsFullscreenPreview(false)}
        giftData={editor.giftData}
        previewKey={editor.previewKey}
      />

      {/* Floating Preview Button for Mobile viewports */}
      {!editor.isPublished && (
        <div className="md:hidden fixed bottom-24 right-6 z-40">
          <button
            onClick={() => editor.setIsFullscreenPreview(true)}
            className="flex items-center gap-1.5 px-4.5 py-3 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-200/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>📱</span> Preview Kado
          </button>
        </div>
      )}

    </div>
  );
}
