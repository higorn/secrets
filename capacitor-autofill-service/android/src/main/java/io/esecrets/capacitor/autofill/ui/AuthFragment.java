package io.esecrets.capacitor.autofill.ui;

import android.annotation.SuppressLint;
import android.app.assist.AssistStructure;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.service.autofill.Dataset;
import android.text.Editable;
import android.text.TextWatcher;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.autofill.AutofillValue;
import android.widget.EditText;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.biometric.BiometricPrompt;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.getcapacitor.JSObject;

import org.jetbrains.annotations.NotNull;

import java.sql.Timestamp;
import java.util.List;
import java.util.concurrent.Executor;

import io.esecrets.capacitor.autofill.R;
import io.esecrets.capacitor.autofill.ViewParser;
import io.esecrets.capacitor.autofill.data.dao.FieldTypeDao;
import io.esecrets.capacitor.autofill.data.model.FieldType;
import io.esecrets.capacitor.autofill.data.model.SecretDataset;
import io.esecrets.capacitor.autofill.helper.BiometricCredentialsHelper;
import io.esecrets.capacitor.autofill.helper.BiometricHelper;

import static android.app.Activity.RESULT_OK;
import static android.view.autofill.AutofillManager.EXTRA_ASSIST_STRUCTURE;
import static android.view.autofill.AutofillManager.EXTRA_AUTHENTICATION_RESULT;
import static io.esecrets.capacitor.autofill.helper.AutofillableFieldsHelper.getAutofillableFields;
import static io.esecrets.capacitor.autofill.helper.BiometricHelper.getBiometricPrompt;
import static io.esecrets.capacitor.autofill.helper.BiometricHelper.getBiometricPromptInfo;
import static io.esecrets.capacitor.autofill.helper.BiometricHelper.isBiometricAvailable;
import static io.esecrets.capacitor.autofill.helper.RemoteViewsHelper.simpleRemoteView;
import static io.esecrets.capacitor.autofill.helper.SecretDatasetHelper.getSecrets;

@SuppressLint("NewApi")
public class AuthFragment extends Fragment {
  private static final String TAG = AuthFragment.class.getSimpleName();

  private BiometricPrompt.PromptInfo biometricPromptInfo;
  private BiometricPrompt biometricPrompt;
  private EditText passwordInput;
  private TextView failMsg;

  public AuthFragment() {
  }

  public static AuthFragment newInstance() {
    return new AuthFragment();
  }

  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d(TAG, "onCreate");
  }

  @Override
  public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
    View view = inflater.inflate(R.layout.fragment_auth, container, false);
    failMsg = view.findViewById(R.id.fail_message);
    setUpPasswordInput(view);
    setUpUnlockBtn(view);
    setUpBiometricBtn(view);
    return view;
  }

  private void setUpPasswordInput(View view) {
    passwordInput = view.findViewById(R.id.password_input);
    passwordInput.addTextChangedListener(new TextWatcher() {
      @Override
      public void beforeTextChanged(CharSequence s, int start, int count, int after) {
      }

      @Override
      public void onTextChanged(CharSequence s, int start, int before, int count) {
      }

      @Override
      public void afterTextChanged(Editable s) {
        enableUnlockBtn(passwordInput, view);
      }

    });
    enableUnlockBtn(passwordInput, view);
  }

  private void enableUnlockBtn(EditText passwordInput, View view) {
    boolean isReady = !passwordInput.getText().toString().isEmpty();
    View unlockBtn = view.findViewById(R.id.unlock_btn);
    unlockBtn.setEnabled(isReady);
  }

  private void setUpUnlockBtn(View view) {
    view.findViewById(R.id.unlock_btn).setOnClickListener(this::unlock);
  }

  private void setUpBiometricBtn(View view) {
    View unlockWithBioBtn = view.findViewById(R.id.unlock_with_bio_btn);
    unlockWithBioBtn.setVisibility(View.INVISIBLE);
    if (BiometricHelper.isBiometricAvailable(getContext())) {
      unlockWithBioBtn.setVisibility(View.VISIBLE);
      unlockWithBioBtn.setOnClickListener(this::unlockWithBio);
    }
  }

  @Override
  public void onViewCreated(@NonNull @NotNull View view, @Nullable @org.jetbrains.annotations.Nullable Bundle savedInstanceState) {
    super.onViewCreated(view, savedInstanceState);
    setUpBiometric();
  }

  private void setUpBiometric() {
    Context context = getContext();
    if (!isBiometricAvailable(context))
      return;

    Executor executor = getExecutor();
    biometricPromptInfo = getBiometricPromptInfo(getResources());
    biometricPrompt = getBiometricPrompt(this, executor, new BiometricPrompt.AuthenticationCallback() {
      @Override
      public void onAuthenticationError(int errorCode, @NonNull CharSequence errString) {
        super.onAuthenticationError(errorCode, errString);
        Log.e(TAG, "Authentication error: " + errorCode + ": " + errString.toString());
        failMsg.setText(R.string.biometric_auth_failed);
      }

      @Override
      public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
        super.onAuthenticationSucceeded(result);
        JSObject credentials = BiometricCredentialsHelper.getCredentials(context, "www.secrets.com");
        doResponse(credentials.getString("password"));
      }

      @Override
      public void onAuthenticationFailed() {
        super.onAuthenticationFailed();
        failMsg.setText(R.string.biometric_auth_failed);
      }
    });
    biometricPrompt.authenticate(biometricPromptInfo);
  }

  private Executor getExecutor() {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
      return this.getActivity().getMainExecutor();
    } else {
      return command -> new Handler().post(command);
    }
  }

  public void unlock(View view) {
    failMsg.setText("");
    EditText passwordInput = view.getRootView().findViewById(R.id.password_input);
    String password = passwordInput.getText().toString();
    try {
      getSecrets(getContext(), password);
      doResponse(password);
    } catch (Exception e) {
      Log.e(TAG, e.getMessage(), e);
      failMsg.setText("Unlock failed. Please try again");
    }
  }

  public void unlockWithBio(View view) {
    failMsg.setText("");
    biometricPrompt.authenticate(biometricPromptInfo);
  }

  private void doResponse(String password) {
    Intent intent = getActivity().getIntent();
    ViewParser viewParser = new ViewParser((AssistStructure) intent.getParcelableExtra(EXTRA_ASSIST_STRUCTURE));
    List<FieldType> fields = getAutofillableFields(viewParser, FieldTypeDao.getInstance(getResources()));
    String datasetName = intent.getStringExtra("datasetName");

    if (datasetName == null) {
      AuthFragmentDirections.ActionAuthFragmentToSecretListFragment action = AuthFragmentDirections
          .actionAuthFragmentToSecretListFragment(password);
      Navigation.findNavController(getActivity(), R.id.navHostContainer).navigate(action);
      return;
    }

    getSecrets(getContext(), password).stream()
        .filter(s -> datasetName.equals(s.getString("name")))
        .findFirst()
        .ifPresent(item -> doResponse(getDataset(item, fields)));
  }

  private void doResponse(Dataset dataset) {
    Intent replyIntent = new Intent();
    replyIntent.putExtra(EXTRA_AUTHENTICATION_RESULT, dataset);
    getActivity().setResult(RESULT_OK, replyIntent);
    getActivity().finish();
  }

  private Dataset getDataset(JSObject item, List<FieldType> fields) {
    SecretDataset secretDataset = new SecretDataset(item, fields);
    Dataset.Builder dataset = new Dataset.Builder(simpleRemoteView(getActivity().getPackageName(), secretDataset.name));
    secretDataset.fields.forEach(field -> populateDataset(dataset, field));
    return dataset.build();
  }

  private void populateDataset(Dataset.Builder dataset, FieldType field) {
    AssistStructure.ViewNode node = field.node;
    switch (node.getAutofillType()) {
      case View.AUTOFILL_TYPE_LIST:
        CharSequence[] options = node.getAutofillOptions();
        int listValue = -1;
        if (options != null) {
          listValue = indexOf(node.getAutofillOptions(), field.value);
        }
        if (listValue != -1)
          dataset.setValue(node.getAutofillId(), AutofillValue.forList(listValue));
        break;
      case View.AUTOFILL_TYPE_DATE:
        String dateStr = field.value;
        if (dateStr != null) {
          Timestamp timestamp = Timestamp.valueOf(dateStr.replace("T", " ").substring(0, dateStr.indexOf(".")));
          dataset.setValue(node.getAutofillId(), AutofillValue.forDate(timestamp.getTime()));
        }
        break;
      case View.AUTOFILL_TYPE_TOGGLE:
        dataset.setValue(node.getAutofillId(), AutofillValue.forToggle(Boolean.valueOf(field.value)));
        break;
      case View.AUTOFILL_TYPE_TEXT:
        dataset.setValue(node.getAutofillId(), AutofillValue.forText(field.value));
        break;
      case View.AUTOFILL_TYPE_NONE:
      default:
        Log.w(TAG, "Invalid autofill type - " + node.getAutofillType());
        break;
    }
  }

  private int indexOf(@NonNull CharSequence[] array, CharSequence charSequence) {
    int index = -1;
    if (charSequence == null) {
      return index;
    }
    for (int i = 0; i < array.length; i++) {
      if (charSequence.equals(array[i])) {
        index = i;
        break;
      }
    }
    return index;
  }
}