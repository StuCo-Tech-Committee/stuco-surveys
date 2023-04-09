import debounce from 'lodash/debounce';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { ISurvey } from '../../controllers/SurveyController';

const SAVE_DELAY = 1000;

const useAutosave = (
  setSaving: (arg0: boolean) => void,
  id: string
): [ISurvey | null, Dispatch<SetStateAction<ISurvey | null>>] => {
  const [survey, setSurvey] = useState<ISurvey | null>(null);
  useEffect(() => {
    (async () => {
      const survey = await fetch(`/api/survey?id=${id}`);
      const surveyJson = await survey.json();
      setSurvey(surveyJson);
    })();
  }, [id]);

  const saveSurvey = useCallback(async (editedSurvey: ISurvey) => {
    await fetch(`/api/survey`, {
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
    if (survey && survey.published) return;
    if (!survey) return;
    setSaving(true);
    debouncedSave(survey);
  }, [survey, debouncedSave, setSaving]);

  return [survey, setSurvey];
};

export default useAutosave;
