import { promises as fs } from 'fs';
import path from 'path';

const uploadRootDir = path.resolve(process.cwd(), 'upload');

const mimeTypes: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function isSafeSegment(segment: string) {
  return !segment.includes('/') && !segment.includes('\\') && segment !== '..' && segment !== '.';
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ segments: string[] }> },
) {
  const notFoundResponse = () => new Response('Not Found', { status: 404 });

  const { segments } = await params;
  if (!segments?.length || !segments.every(isSafeSegment)) {
    return notFoundResponse();
  }

  const candidates = [path.resolve(uploadRootDir, ...segments)];
  try {
    const decodedSegments = segments.map((segment) => decodeURIComponent(segment));
    const decodedCandidate = path.resolve(uploadRootDir, ...decodedSegments);
    if (!candidates.includes(decodedCandidate)) {
      candidates.push(decodedCandidate);
    }
  } catch {
    // decode 不能なセグメントは raw 値の候補だけを使う
  }

  try {
    let filePath: string | null = null;
    for (const candidatePath of candidates) {
      if (candidatePath !== uploadRootDir && !candidatePath.startsWith(`${uploadRootDir}${path.sep}`)) {
        continue;
      }

      try {
        const stats = await fs.stat(candidatePath);
        if (stats.isFile()) {
          filePath = candidatePath;
          break;
        }
      } catch {
        // 次候補へ
      }
    }

    if (!filePath) {
      return notFoundResponse();
    }

    const content = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] ?? 'application/octet-stream';

    return new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return notFoundResponse();
  }
}
