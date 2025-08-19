// code authored by Claude Sonnet 4
import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { OptionalPatch, PatchCategory } from '@/components/CustomOptionsPanel';

interface OptionalPatchesConfig {
  zipFiles?: string[]; // Array of ZIP file paths in public directory
  categories?: {
    id: string;
    title: string;
    description?: string;
    allowMultiple?: boolean;
    zipFile?: string; // Specific ZIP file for this category
    filePattern?: RegExp; // Pattern to match files in ZIP
  }[];
}

export const useOptionalPatches = (config: OptionalPatchesConfig) => {
  const [categories, setCategories] = useState<PatchCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOptionalPatches = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadedCategories: PatchCategory[] = [];

        if (config.categories) {
          // Load patches organized by categories
          for (const categoryConfig of config.categories) {
            const patches: OptionalPatch[] = [];
            
            if (categoryConfig.zipFile) { // zip handling
              try {
                const response = await fetch(`/${categoryConfig.zipFile}`);
                const zipData = await response.arrayBuffer();
                if (zipData.byteLength === 0) { // log for empty zip
                  console.warn(`Empty ZIP file: ${categoryConfig.zipFile}`);
                  continue;
                }
                console.log(`Loading ${categoryConfig.zipFile} (${zipData.byteLength} bytes)`);
                const zip = await JSZip.loadAsync(zipData);

                await Promise.all(
                  Object.keys(zip.files).map(async (filename) => {
                    const file = zip.files[filename];
                    // Skip directories and non-IPS files
                    if (file.dir || !file.name.toLowerCase().endsWith('.ips')) {
                      return;
                    }
                    // Apply file pattern filter if available
                    if (categoryConfig.filePattern && !categoryConfig.filePattern.test(file.name)) {
                      return;
                    }

                    try {
                      const originalName = file.name.split('/').pop() || file.name;
                      const data = new Uint8Array(await file.async('arraybuffer'));
                      
                      // Verification for IPS file
                      const header = new TextDecoder().decode(data.slice(0, 5));
                      if (header !== 'PATCH') { // they rly do start with 'PATCH' internally
                        console.warn(`Skipping invalid IPS file: ${file.name}`);
                        return;
                      }

                      // Creates clean UI name from filename
                      const displayName = originalName
                        .replace(/\.ips$/i, '') // excise file extension
                        .replace(/[-_]/g, ' ') // dashes to spaces
                        .replace(/\b\w/g, l => l.toUpperCase()); // capitalize each word
                      // Generates preview image path (public/previews/)
                      const previewImagePath = `/previews/${originalName.replace(/\.ips$/i, '')}.png`;

                      
                      
                      patches.push({
                        id: `${categoryConfig.id}-${originalName}`,
                        name: displayName,
                        description: `Apply ${displayName} modifications`,
                        filename: originalName,
                        data,
                        category: categoryConfig.id,
                        previewImage: previewImagePath
                      });

                      console.log(`Loaded optional patch: ${displayName} from ${originalName}`);
                    } catch (err) {
                      console.error(`Error processing patch file ${file.name}:`, err);
                    }
                  })
                );
              } catch (err) {
                console.error(`Failed to load patches from ${categoryConfig.zipFile}:`, err);
              }
            }

            loadedCategories.push({
              id: categoryConfig.id,
              title: categoryConfig.title,
              description: categoryConfig.description,
              patches: patches.sort((a, b) => a.name.localeCompare(b.name)),
              allowMultiple: categoryConfig.allowMultiple ?? true
            });
          }
        } else if (config.zipFiles) {
          // Load all patches from specified ZIP files (legacy approach)
          for (const zipFile of config.zipFiles) {
            try {
              const response = await fetch(`/${zipFile}`);
              const zipData = await response.arrayBuffer();
              const zip = await JSZip.loadAsync(zipData);
              const patches: OptionalPatch[] = [];

              await Promise.all(
                Object.keys(zip.files).map(async (filename) => {
                  const file = zip.files[filename];
                  
                  if (file.dir || !file.name.toLowerCase().endsWith('.ips')) {
                    return;
                  }

                  try {
                    const originalName = file.name.split('/').pop() || file.name;
                    const data = new Uint8Array(await file.async('arraybuffer'));
                    
                    const header = new TextDecoder().decode(data.slice(0, 5));
                    if (header !== 'PATCH') {
                      console.warn(`Skipping invalid IPS file: ${file.name}`);
                      return;
                    }

                    const displayName = originalName
                      .replace(/\.ips$/i, '') // excise file extension
                      .replace(/[-_]/g, ' ') // dashes to spaces
                      .replace(/\b\w/g, l => l.toUpperCase()); // capitalize each word

                    patches.push({
                      id: originalName,
                      name: displayName,
                      description: `Apply ${displayName} modifications`,
                      filename: originalName,
                      data
                    });
                  } catch (err) {
                    console.error(`Error processing patch file ${file.name}:`, err);
                  }
                })
              );

              if (patches.length > 0) {
                loadedCategories.push({
                  id: `patches-${zipFile}`,
                  title: `Optional Patches from ${zipFile}`,
                  patches: patches.sort((a, b) => a.name.localeCompare(b.name)),
                  allowMultiple: true
                });
              }
            } catch (err) {
              console.error(`Failed to load patches from ${zipFile}:`, err);
            }
          }
        }

        console.log(`Successfully loaded ${loadedCategories.length} patch categories`);
        setCategories(loadedCategories);
      } catch (err) {
        console.error('Failed to load optional patches:', err);
        setError('Failed to load optional patch files.');
      } finally {
        setLoading(false);
      }
    };

    loadOptionalPatches();
  }, [config]);

  // Helper function to get selected patch objects by their IDs
  const getSelectedPatches = (selectedIds: string[]): OptionalPatch[] => {
    const allPatches = categories.flatMap(cat => cat.patches);
    return selectedIds
      .map(id => allPatches.find(patch => patch.id === id))
      .filter((patch): patch is OptionalPatch => patch !== undefined);
  };

  return {
    categories,
    loading,
    error,
    getSelectedPatches
  };
};