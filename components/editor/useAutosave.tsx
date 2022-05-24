import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { server } from '../../config';
import { ISurvey } from '../../utilities/manager/SurveyManager';
import debounce from 'lodash/debounce';

const SAVE_DELAY = 1000;

const useAutosave = (
  initialSurvey: ISurvey,
  setSaving: (arg0: boolean) => void
): [ISurvey, Dispatch<SetStateAction<ISurvey>>] => {
  const [survey, setSurvey] = useState(initialSurvey);

  const saveSurvey = useCallback(async (editedSurvey: ISurvey) => {
    await fetch(`${server}/api/survey`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(editedSurvey),
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(
      async (editedSurvey: ISurvey) => {
        await saveSurvey(editedSurvey);
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
        setSaving(false);
      },
      SAVE_DELAY,
      { leading: true }
    ),
    [saveSurvey, setSaving]
  );

  useEffect(() => {
    setSaving(true);
    debouncedSave(survey);
  }, [survey, debouncedSave, setSaving]);

  return [survey, setSurvey];
};

export default useAutosave;
