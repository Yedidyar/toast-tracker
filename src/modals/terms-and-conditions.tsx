/* eslint-disable react/no-unescaped-entities */
import NiceModal, { useModal } from "@ebay/nice-modal-react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import React, { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";

export const termsAndConditionsLocalStorageKey =
  "show-terms-and-conditions-modal-again";

export const TermsAndConditionsModal = NiceModal.create(() => {
  const modal = useModal();
  const closeModal = () => {
    modal.resolve({ resolved: true });
    void modal.hide();
  };

  const [showTermsAndConditions, setShowTermsAndConditions] = useLocalStorage(
    termsAndConditionsLocalStorageKey,
    true
  );

  const [isApproved, setIsApproved] = useState<CheckedState>(false);

  return (
    <AlertDialog open={modal.visible}>
      <AlertDialogContent className="sm:max-w-[425px] lg:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>תנאי שימוש</AlertDialogTitle>
          <AlertDialogDescription>
            יום רביעי 22 יוני 2022
            <br />
            לשימושכם, מצ"ב קיטוע מפקודת מטכ"ל בנושא שתיות:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <ScrollArea className="h-[60vh]">
          <section className="p-4">
            <ol className="flex list-decimal flex-col gap-4">
              <li>
                שתייה תכלול מזון ומשקאות המוגשים על מנת לציין מאורע משמח במדור
                ביצועים.
              </li>
              <li>
                כל קצין, נגד, חייל ואע"צ במדור יקיים שתייה על מנת לחגוג אירוע
                משמח, לרבות: הגעה למדור ביצועים, קבלת דרגה, יום הולדת. פרסום
                דו"ח ראשון, דמ"ח, מעבר תפקיד וכדומה.
              </li>
              <li>
                רשימת האירועים המחייבים שתייה תוגדר ע"י מוקד ידע שתיות. במקרים
                בהם לא הוגדרה שתיית חובה, יוכל הקצין לבחור לקיים שתיית התנדבות,
                וכל המרבה הרי זה משובח.
              </li>
              <li>לא יאושר איחוד שתיות.</li>
              <li>
                מועמד לשירות במדור ביצועים יידרש להוכיח במסגרת כישוריו. יכולת
                ביצוע ברמה גבוהה בתחום השתיות.
                <br />
                <span className="text-sm text-muted-foreground">
                  תוקף סעיף משנה א מה- 1 מארס 2012
                </span>
              </li>
              <li>מעקב ומדידה למספר השתיות תוצג בסקר המפקד בכל תקופה.</li>
              <li>
                קנסות וסנקציות:
                <ol className=" mr-8 flex list-[hebrew] flex-col gap-4">
                  <li>
                    קצין אשר לא יזמן שתייה עד למועד המאורע המשמח או זמן הסמוך
                    המוקדם ביותר האפשרי. שמו ייכתב על לוח עברייני השתיות ע"ש שי
                    אורן היקר. שאין לחללו.
                  </li>
                  <li>
                    קצין אשר לא ישלים בלו"ז קצר את חובו, ייקנס ע"י מוקד : ידע
                    שתיות בשתיית קנס.
                  </li>
                  <li>
                    תיקון 3א'/ר': כל עוד לנישום חובות שתייה למדור ביצועים. כל
                    שמחה שבגינה היה הנישום מקיים שתייה. לו היה משרת פעיל במדור
                    ביצועים, מחייבת את הנישום בקיום שתייה. כאילו שירת הנישום
                    שירות פעיל במדור.
                  </li>
                  <li>
                    במקרים חריגים יישקלו ע"י הרמ"ד המשך שירותו כמו גם נקיטת
                    הליכים משמעתיים ופיקודיים. לא יחתום הרמ"ד על קלירנס יציאה
                    מבלי שווידא כי הקצין השלים את כלל חובותיו תחת הסעיפיס לעיל
                  </li>
                </ol>
              </li>
              <li>
                בכל מקרה של סתירה בין הפקודה המופיעה במסמך זה לבין הגרסה המופיעה
                אצל מוקד ידע שתיות, יגבר האחרון
              </li>
            </ol>
          </section>
        </ScrollArea>
        <AlertDialogFooter className="gap-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-4">
              <Checkbox
                id="terms"
                checked={isApproved}
                onCheckedChange={setIsApproved}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="terms">אשר/י את תנאי השימוש</Label>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Checkbox
                checked={!showTermsAndConditions}
                onCheckedChange={(checked) => {
                  setShowTermsAndConditions(!checked);
                }}
                id="do-not-show"
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="do-not-show">לא להציג שוב</Label>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              disabled={!isApproved}
              onClick={closeModal}
              className="w-1/3"
            >
              אישור
            </Button>
            <Button
              onClick={closeModal}
              variant="destructive"
              className="w-1/3"
            >
              לא אני דור שטרית
            </Button>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
});
