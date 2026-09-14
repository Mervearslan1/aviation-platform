package com.alp.common.validation;

import com.alp.common.exception.ApiException;
import com.alp.common.exception.ErrorCode;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class PasswordPolicyTest {

    @Test
    void acceptsStrongPassword() {
        PasswordPolicy.validate("Password123!");
    }

    @Test
    void rejectsMissingSpecialCharacter() {
        assertThatThrownBy(() -> PasswordPolicy.validate("Password123"))
                .isInstanceOf(ApiException.class)
                .extracting(ex -> ((ApiException) ex).getCode())
                .isEqualTo(ErrorCode.VALIDATION_ERROR);
    }

    @Test
    void rejectsTooShortPassword() {
        assertThatThrownBy(() -> PasswordPolicy.validate("Pa1!"))
                .isInstanceOf(ApiException.class);
    }

    @Test
    void errorMessageExplainsPolicy() {
        assertThatThrownBy(() -> PasswordPolicy.validate("password"))
                .isInstanceOf(ApiException.class)
                .extracting(Throwable::getMessage)
                .asString()
                .contains("uppercase");
        assertThat(PasswordPolicy.MIN_LENGTH).isEqualTo(8);
    }
}
