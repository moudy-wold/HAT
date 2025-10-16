import { AddQuestion, GetMealQuestions } from "@/api/meals";
import Loader from "@/components/Global/Loader/Loader";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import tw from "twrnc";

export default function QuestionsSection({ mealId }: { mealId: string }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  // New state for TextInput
  const [newQuestion, setNewQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getData = async (pageNum: number) => {
    setLoading(true);
    try {
      const res: any = await GetMealQuestions(mealId, pageNum);
      setData(res?.data?.data?.data);
      setPagination(res?.data?.data?.pagination);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) getData(page);
  }, [mealId, page, open]);

  const handleAddQuestion = async () => {
    const q = newQuestion.trim();
    if (!q || submitting) return;
    setSubmitting(true);
    try {
      await AddQuestion(mealId, q);
      const optimistic = {
        id: Date.now().toString(),
        user: "You",
        question: q,
        answer: null,
        created_at: new Date().toISOString(),
        answered_at: null,
      };
      setData((prev) => [optimistic, ...prev]);
      setNewQuestion("");
      Keyboard.dismiss();
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <View
      style={[
        tw`bg-white rounded-2xl p-4 mt-4 w-full shadow-lg`,
        {
          direction: i18n?.language === "ar" ? "rtl" : "ltr",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 10,
          elevation: 8,
        },
      ]}
    >
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={[
          tw`w-full flex-row justify-between items-center px-4 py-4 rounded-xl mb-2`,
          {
            backgroundColor: open ? "#f0f9ff" : "#fafafa",
            borderWidth: 1,
            borderColor: open ? "#0ea5e9" : "#e5e7eb",
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            tw`font-bold text-lg`,
            { color: open ? "#0369a1" : "#374151" },
          ]}
        >
          {t("user_questions")}
        </Text>
        <View
          style={[
            tw`w-8 h-8 rounded-full items-center justify-center`,
            {
              backgroundColor: open ? "#0ea5e9" : "#6b7280",
              transform: [{ rotate: open ? "180deg" : "0deg" }],
            },
          ]}
        >
          <Text style={tw`text-white font-bold`}>▼</Text>
        </View>
      </TouchableOpacity>

      {open && (
        <View style={tw`mt-3`}>
          {loading ? (
            <Loader />
          ) : (
            <ScrollView
              style={tw`w-full max-h-96`}
              contentContainerStyle={tw`gap-4 pb-4`}
            >
              {data?.length === 0 ? (
                <Text style={tw`text-sm text-gray-500`}>
                  {t("there_are_no_questions_yet")}
                </Text>
              ) : (
                data?.map((q: any, index) => (
                  <View
                    key={q?.id}
                    style={[
                      tw`rounded-2xl p-4 mb-3`,
                      {
                        backgroundColor: "#ffffff",
                        borderWidth: 1,
                        borderColor: q?.answer ? "#d1fae5" : "#f3f4f6",
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                      },
                    ]}
                  >
                    <View
                      style={tw`flex-row justify-between items-center mb-3`}
                    >
                      <View style={tw`flex-row items-center`}>
                        <View
                          style={[
                            tw`w-8 h-8 rounded-full items-center justify-center mr-2`,
                            { backgroundColor: "#3b82f6" },
                          ]}
                        >
                          <Text style={tw`text-white font-bold text-xs`}>
                            {q?.user_name?.charAt(0)?.toUpperCase() || "U"}
                          </Text>
                        </View>
                        <Text style={[tw`font-semibold`, { color: "#1f2937" }]}>
                          {q?.user_name}
                        </Text>
                      </View>
                      <View
                        style={[
                          tw`px-3 py-1 rounded-full`,
                          { backgroundColor: "#f1f5f9" },
                        ]}
                      >
                        <Text style={tw`text-xs text-gray-500 font-medium`}>
                          {new Date(q?.created_at).toLocaleDateString("ar-EG")}
                        </Text>
                      </View>
                    </View>
                    <View
                      style={[
                        tw`p-3 rounded-xl mb-3`,
                        { backgroundColor: "#f8fafc" },
                      ]}
                    >
                      <Text
                        style={[tw`text-base leading-6`, { color: "#374151" }]}
                      >
                        {" "}
                        {q?.question}
                      </Text>
                    </View>
                    {q?.answer ? (
                      <View
                        style={[
                          tw`p-4 rounded-xl`,
                          {
                            backgroundColor: "#ecfdf5",
                            borderLeftWidth: 4,
                            borderLeftColor: "#10b981",
                          },
                        ]}
                      >
                        <View style={tw`flex-row items-start`}>
                          <View
                            style={[
                              tw`w-6 h-6 rounded-full items-center justify-center mr-2 mt-1`,
                              { backgroundColor: "#10b981" },
                            ]}
                          >
                            <Text style={tw`text-white text-xs`}>✓</Text>
                          </View>
                          <Text
                            style={[
                              tw`text-base flex-1 leading-6`,
                              { color: "#065f46" },
                            ]}
                          >
                            {q?.answer}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={[
                          tw`p-3 rounded-xl flex-row items-center`,
                          { backgroundColor: "#fef3c7" },
                        ]}
                      >
                        <View
                          style={[
                            tw`w-5 h-5 rounded-full items-center justify-center mr-2`,
                            { backgroundColor: "#f59e0b" },
                          ]}
                        >
                          <Text style={tw`text-white text-xs`}>⏳</Text>
                        </View>
                        <Text
                          style={[
                            tw`text-sm font-medium`,
                            { color: "#92400e" },
                          ]}
                        >
                          {t("waiting_for_the_admin_answer")}
                        </Text>
                      </View>
                    )}
                  </View>
                ))
              )}
            </ScrollView>
          )}

          {pagination && pagination?.last_page > 1 && (
            <View style={tw`flex-row justify-center items-center gap-4 mt-6`}>
              <TouchableOpacity
                disabled={pagination?.current_page === 1}
                onPress={() => setPage((p) => p - 1)}
                style={[
                  tw`px-6 py-3 rounded-xl flex-row items-center`,
                  {
                    backgroundColor:
                      pagination?.current_page === 1 ? "#f3f4f6" : "#3b82f6",
                    opacity: pagination?.current_page === 1 ? 0.5 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-semibold`,
                    {
                      color:
                        pagination?.current_page === 1 ? "#9ca3af" : "#ffffff",
                    },
                  ]}
                >
                  ← {t("previous")}
                </Text>
              </TouchableOpacity>

              <View
                style={[
                  tw`px-4 py-2 rounded-lg`,
                  { backgroundColor: "#f1f5f9" },
                ]}
              >
                <Text style={[tw`font-bold`, { color: "#1e40af" }]}>
                  {pagination?.current_page} / {pagination?.last_page}
                </Text>
              </View>

              <TouchableOpacity
                disabled={pagination?.current_page === pagination?.last_page}
                onPress={() => setPage((p) => p + 1)}
                style={[
                  tw`px-6 py-3 rounded-xl flex-row items-center`,
                  {
                    backgroundColor:
                      pagination?.current_page === pagination?.last_page
                        ? "#f3f4f6"
                        : "#3b82f6",
                    opacity:
                      pagination?.current_page === pagination?.last_page
                        ? 0.5
                        : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    tw`font-semibold`,
                    {
                      color:
                        pagination?.current_page === pagination?.last_page
                          ? "#9ca3af"
                          : "#ffffff",
                    },
                  ]}
                >
                  {t("next")} →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {/* Start New Question Input */}
      <View
        style={[
          tw`${open ? "my-4" : "mt-6"} p-4 rounded-2xl`,
          {
            backgroundColor: "#f8fafc",
            borderWidth: 1,
            borderColor: "#e2e8f0",
          },
        ]}
      >
        <View style={tw`flex-row items-center mb-3`}>
          <View
            style={[
              tw`w-6 h-6 rounded-full items-center justify-center mr-2`,
              { backgroundColor: "#3b82f6" },
            ]}
          >
            <Text style={tw`text-white text-xs font-bold`}>?</Text>
          </View>
          <Text style={[tw`font-bold text-lg`, { color: "#1e40af" }]}>
            {t("ask_a_question")}
          </Text>
        </View>
        <View style={tw`flex-row items-start gap-3`}>
          <TextInput
            value={newQuestion}
            onChangeText={setNewQuestion}
            placeholder={t("write_your_question_here")}
            multiline
            style={[
              tw`flex-1 px-4 py-3 text-base rounded-xl`,
              {
                backgroundColor: "#ffffff",
                borderWidth: 2,
                borderColor: newQuestion.trim() ? "#3b82f6" : "#e5e7eb",
                textAlignVertical: "top",
                color: "#374151",
              },
            ]}
            maxLength={300}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity
            onPress={handleAddQuestion}
            disabled={!newQuestion.trim() || submitting}
            style={[
              tw`px-4 py-3 rounded-xl items-center justify-center min-w-[80px]`,
              {
                backgroundColor:
                  newQuestion.trim() && !submitting ? "#10b981" : "#d1d5db",
                shadowColor:
                  newQuestion.trim() && !submitting ? "#10b981" : "transparent",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: newQuestion.trim() && !submitting ? 6 : 0,
              },
            ]}
            activeOpacity={0.8}
          >
            {submitting ? (
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-white font-semibold text-sm mr-1`}>
                  ⏳
                </Text>
                <Text style={tw`text-white font-semibold text-sm`}>...</Text>
              </View>
            ) : (
              <View style={tw`flex-row items-center`}>
                <Text
                  style={[
                    tw`font-bold text-sm ml-1`,
                    { color: newQuestion.trim() ? "#ffffff" : "#9ca3af" },
                  ]}
                >
                  {t("send")}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={tw`flex-row justify-between items-center mt-2`}>
          <Text style={tw`text-xs text-gray-500`}>
            💡 {t("write_your_question_clearly_for_better_answers")}
          </Text>
          <View
            style={[
              tw`px-2 py-1 rounded-full`,
              {
                backgroundColor:
                  newQuestion.length > 250 ? "#fef2f2" : "#f0f9ff",
              },
            ]}
          >
            <Text
              style={[
                tw`text-xs font-bold`,
                {
                  color: newQuestion.length > 250 ? "#dc2626" : "#0369a1",
                },
              ]}
            >
              {newQuestion.length}/300
            </Text>
          </View>
        </View>
      </View>
      {/* End New Question Input */}
    </View>
  );
}
