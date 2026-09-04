"use client";
import { useState } from "react";
import { SOCIAL_FIELDS } from "@/lib/settings/schema";
import { Instagram, Facebook, LinkedIn } from "@/components/Icons";
import { useAdminI18n } from "../i18n/AdminI18n";
import { Field, Note, Panel, SaveBar, cardCls, legendCls } from "./shared";

/* Gruppe „Social" — die Profile der Marke.

   Zwei verschiedene Dinge stehen hier nebeneinander, und der Unterschied
   ist der Grund für die Aufteilung im Panel:

     Die drei Adressen gehen als `sameAs` in die strukturierten Daten. Das
     ist der Weg, auf dem Google Website und Profile zu EINER Entität
     zusammenzieht — ein fehlendes Profil ist eine verpasste Bestätigung,
     ein falsches eine falsche Zuordnung.

     Der Handle ist Text: Er steht auf der Pinnwand des Magazins („Folgen
     Sie @mariamaria.wine") und wird nie angeklickt.

   Dass die Profile unter mariamaria.wine laufen, während die Postadresse
   .de ist, ist kein Fehler und wird hier nicht stillschweigend angeglichen:
   Handles sind Eigennamen, die Postadresse ist es nicht. */

const ICON = { instagram: Instagram, facebook: Facebook, linkedin: LinkedIn };

export default function SocialPanel({ record, onSaved }) {
  const { t } = useAdminI18n();

  const seed = record.social.seed;
  const [draft, setDraft] = useState(record.social.value);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);

  const dirty = SOCIAL_FIELDS.some((f) => (draft[f.key] ?? "") !== (record.social.value[f.key] ?? ""));

  const set = (key, value) => setDraft((d) => ({ ...d, [key]: value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSaved({ social: draft });
      setSavedAt(Date.now());
      window.setTimeout(() => setSavedAt(null), 2800);
    } catch (e) {
      setError(e);
    } finally {
      setSaving(false);
    }
  };

  const profiles = SOCIAL_FIELDS.filter((f) => f.kind === "url");
  const handleField = SOCIAL_FIELDS.find((f) => f.kind === "handle");
  const handle = draft.handle ?? "";

  return (
    <Panel>
      <section className={`${cardCls} mx-auto max-w-[860px]`}>
        <p className={legendCls}>{t("settings.social.legend")}</p>
        <h3 className="mt-1.5 font-playfair text-[19px] leading-tight text-a-ink">
          {t("settings.social.title")}
        </h3>
        <p className="mt-2 max-w-[64ch] text-[12.5px] leading-relaxed text-a-ink/55">
          {t("settings.social.lede")}
        </p>

        <div className="mt-6 flex flex-col gap-4">
          {profiles.map((f) => {
            const Icon = ICON[f.key];
            const value = draft[f.key] ?? "";
            const changed = value !== (seed[f.key] ?? "");
            return (
              <div key={f.key} className="flex items-start gap-3.5">
                <span className="mt-[26px] grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-a-ink/12 text-a-ink/55">
                  <Icon className="h-[17px] w-[17px]" />
                </span>
                <div className="min-w-0 flex-1">
                  <Field
                    label={t(`settings.social.fields.${f.key}`)}
                    value={value}
                    onChange={(v) => set(f.key, v)}
                    changed={changed}
                    onRevert={() => set(f.key, seed[f.key] ?? "")}
                    maxLength={f.max}
                    type="url"
                    inputMode="url"
                    placeholder={`https://www.${f.host}/…`}
                    aside={
                      value.trim() ? (
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-[10.5px] uppercase tracking-[0.1em] text-a-accent/70 underline-offset-2 transition-colors hover:text-a-accent hover:underline"
                        >
                          {t("settings.social.open")}
                        </a>
                      ) : (
                        <span className="text-[10.5px] uppercase tracking-[0.1em] text-a-ink/35">
                          {t("settings.social.omitted")}
                        </span>
                      )
                    }
                  />
                </div>
              </div>
            );
          })}

          <div className="mt-2 border-t border-a-ink/[0.08] pt-5">
            <div className="max-w-[420px]">
              <Field
                label={t("settings.social.fields.handle")}
                hint={t("settings.social.handleHint")}
                value={handle}
                onChange={(v) => set("handle", v)}
                changed={handle !== (seed.handle ?? "")}
                onRevert={() => set("handle", seed.handle ?? "")}
                maxLength={handleField.max}
                placeholder="@name"
              />
            </div>
            {/* Wie der Handle auf der Pinnwand des Magazins erscheint. */}
            <p className="mt-3 text-[12.5px] text-a-ink/45">
              {t("settings.social.handlePreview")}{" "}
              <span className="font-playfair text-[15px] italic text-a-accent">
                {handle || "—"}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Note>{t("settings.social.sameAsNote")}</Note>
        </div>

        <SaveBar
          onReset={() => setDraft(seed)}
          onSave={save}
          saving={saving}
          savedAt={savedAt}
          dirty={dirty}
          error={error}
          resetLabel={t("settings.resetToCode")}
        />
      </section>
    </Panel>
  );
}
