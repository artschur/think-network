import { FlickeringGrid } from './magicui/flickering-grid';

export default function BackgroundImages() {
  return (
    <div className="fixed inset-0 z-10 w-full h-full overflow-hidden">
      <FlickeringGrid
        className="absolute inset-0 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]"
        squareSize={4}
        gridGap={6}
        color="#12aa57"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
    </div>
  );
}
